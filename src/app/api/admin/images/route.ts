import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
	createServerSupabaseAdminClient,
	createServerSupabaseClient,
} from "@/lib/supabase/server";
import { isAdminUser } from "@/src/entities/admin";
import type {
	AdminBuildImage,
	AdminImageBuild,
	AdminImagesResponse,
} from "@/src/entities/admin/model/adminImages.types";
import {
	BUILDS_LIST_TAG,
	getBuildDetailTag,
} from "@/src/entities/builds/api/buildsCache";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";
import {
	BUILD_IMAGE_BUCKET,
	isBuildImageStoragePath,
} from "@/src/shared/model/buildImage";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;
const BUILD_IMAGE_TAG_PATTERN = /<img\b[^>]*data-build-image="true"[^>]*>/gi;

type AdminImageBuildRow = Pick<
	BuildRow,
	"created_at" | "description" | "postUuid" | "title" | "updated_at" | "writer"
>;

const getAttribute = (tag: string, name: string) =>
	tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1] ?? "";

const getBuildImages = (
	description: string,
	postUuid: string,
): AdminBuildImage[] => {
	const safeDescription = sanitizeBuildDescriptionHtml(description, {
		postUuid,
	});

	return [...safeDescription.matchAll(BUILD_IMAGE_TAG_PATTERN)]
		.map(([tag]) => ({
			src: getAttribute(tag, "src"),
			storagePath: getAttribute(tag, "data-storage-path"),
		}))
		.filter(({ src, storagePath }) => Boolean(src && storagePath));
};

const requireAdmin = async () => {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return Boolean(user && (await isAdminUser(user.id)));
};

export const GET = async (request: Request) => {
	try {
		if (!(await requireAdmin())) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(request.url);
		const requestedPage = Number(searchParams.get("page") ?? 1);
		const requestedPageSize = Number(
			searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
		);
		const page = Number.isInteger(requestedPage)
			? Math.max(requestedPage, 1)
			: 1;
		const pageSize = Number.isInteger(requestedPageSize)
			? Math.min(Math.max(requestedPageSize, 1), MAX_PAGE_SIZE)
			: DEFAULT_PAGE_SIZE;
		const from = (page - 1) * pageSize;
		const admin = await createServerSupabaseAdminClient();
		const { data, count, error } = await admin
			.from("builds")
			.select("postUuid,title,description,created_at,updated_at,writer", {
				count: "exact",
			})
			.like("description", '%data-build-image="true"%')
			.order("updated_at", { ascending: false, nullsFirst: false })
			.order("created_at", { ascending: false })
			.range(from, from + pageSize - 1);

		if (error) throw error;

		const builds = ((data ?? []) as AdminImageBuildRow[])
			.map(
				(build): AdminImageBuild => ({
					createdAt: build.created_at,
					images: getBuildImages(build.description, build.postUuid),
					postUuid: build.postUuid,
					title: build.title,
					updatedAt: build.updated_at,
					writer: build.writer,
				}),
			)
			.filter((build) => build.images.length > 0);
		const response: AdminImagesResponse = {
			count: count ?? 0,
			data: builds,
			page,
			pageSize,
		};

		return NextResponse.json(response, {
			headers: { "Cache-Control": "private, no-store" },
		});
	} catch (error) {
		console.error("GET /api/admin/images failed", error);
		return NextResponse.json(
			{ message: "Failed to load build images" },
			{ status: 500 },
		);
	}
};

export const DELETE = async (request: Request) => {
	try {
		if (!(await requireAdmin())) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		const payload = (await request.json()) as {
			postUuid?: unknown;
			storagePath?: unknown;
		};
		if (
			typeof payload.postUuid !== "string" ||
			typeof payload.storagePath !== "string" ||
			!isBuildImageStoragePath(payload.storagePath, {
				postUuid: payload.postUuid,
			})
		) {
			return NextResponse.json(
				{ message: "Invalid image path" },
				{ status: 400 },
			);
		}

		const admin = await createServerSupabaseAdminClient();
		const { data: build, error: buildError } = await admin
			.from("builds")
			.select("description")
			.eq("postUuid", payload.postUuid)
			.maybeSingle();

		if (buildError) throw buildError;
		if (!build) {
			return NextResponse.json({ message: "Not found" }, { status: 404 });
		}

		const safeDescription = sanitizeBuildDescriptionHtml(build.description, {
			postUuid: payload.postUuid,
		});
		let wasRemoved = false;
		const nextDescription = safeDescription.replace(
			BUILD_IMAGE_TAG_PATTERN,
			(tag) => {
				if (getAttribute(tag, "data-storage-path") !== payload.storagePath) {
					return tag;
				}

				wasRemoved = true;
				return "";
			},
		);

		if (!wasRemoved) {
			return NextResponse.json(
				{ message: "Image is not attached to this build" },
				{ status: 404 },
			);
		}

		const { data: updatedBuild, error: updateError } = await admin
			.from("builds")
			.update({
				description: nextDescription,
				updated_at: new Date().toISOString(),
			})
			.eq("postUuid", payload.postUuid)
			.eq("description", build.description)
			.select("postUuid")
			.maybeSingle();

		if (updateError) throw updateError;
		if (!updatedBuild) {
			return NextResponse.json(
				{ message: "게시글이 변경되었습니다. 새로고침 후 다시 시도해 주세요." },
				{ status: 409 },
			);
		}

		const { error: removeError } = await admin.storage
			.from(BUILD_IMAGE_BUCKET)
			.remove([payload.storagePath]);
		if (removeError) {
			console.error("Failed to remove managed build image", removeError);
		}

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(payload.postUuid));

		return NextResponse.json({
			removed: true,
			storageRemoved: !removeError,
		});
	} catch (error) {
		console.error("DELETE /api/admin/images failed", error);
		return NextResponse.json(
			{ message: "Failed to remove build image" },
			{ status: 500 },
		);
	}
};
