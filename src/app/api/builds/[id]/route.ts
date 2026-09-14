import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
	createServerSupabaseAdminClient,
	createServerSupabaseClient,
} from "@/lib/supabase/server";
import { isAdminUser } from "@/src/entities/admin";
import {
	BUILDS_LIST_TAG,
	getBuildDetailCached,
	getBuildDetailTag,
} from "@/src/entities/builds/api/buildsCache";
import { getArtifactValues } from "@/src/entities/builds/lib/getArtifactValues";
import type { UpdateBuildType } from "@/src/entities/modify-build/model/updateBuild.types";
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";
import {
	BUILD_IMAGE_BUCKET,
	BUILD_IMAGE_MAX_COUNT,
	extractBuildImageStoragePaths,
	isBuildImageStoragePath,
} from "@/src/shared/model/buildImage";
import {
	isValidPresetCode,
	normalizePresetCode,
} from "@/src/shared/model/presetCode";

export const dynamic = "force-dynamic";

type RouteContext = {
	params: Promise<{ id: string }>;
};

const removeBuildImages = async (paths: string[], postUuid: string) => {
	const safePaths = [
		...new Set(
			paths.filter((path) => isBuildImageStoragePath(path, { postUuid })),
		),
	];
	if (safePaths.length === 0) return;

	const admin = await createServerSupabaseAdminClient();
	const { error } = await admin.storage
		.from(BUILD_IMAGE_BUCKET)
		.remove(safePaths);

	if (error) {
		console.error("Failed to remove build images", error);
	}
};

export const GET = async (_request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const result = await getBuildDetailCached(id);

		if (!result.data) {
			return NextResponse.json({ message: "Not found" }, { status: 404 });
		}

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("GET /api/builds/[id] failed", error);
		return NextResponse.json(
			{ message: "Failed to fetch build detail" },
			{ status: 500 },
		);
	}
};

export const PATCH = async (request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const payload = (await request.json()) as UpdateBuildType;
		const supabase = await createServerSupabaseClient();
		const presetCode = normalizePresetCode(payload.preset_code);
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Login is required" },
				{ status: 401 },
			);
		}

		const { data: currentBuild } = await getBuildDetailCached(id);
		if (!currentBuild) {
			return NextResponse.json({ message: "Not found" }, { status: 404 });
		}

		const isOwner = currentBuild.writer.uuid === user.id;
		const isAdmin = await isAdminUser(user.id);
		if (!isOwner && !isAdmin) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		if (presetCode && !isValidPresetCode(presetCode)) {
			return NextResponse.json(
				{ message: "Invalid preset code" },
				{ status: 400 },
			);
		}

		const description = sanitizeBuildDescriptionHtml(payload.description, {
			postUuid: id,
			userId: isAdmin ? undefined : user.id,
		});
		const nextImagePaths = extractBuildImageStoragePaths(description);
		if (nextImagePaths.length > BUILD_IMAGE_MAX_COUNT) {
			return NextResponse.json(
				{ message: `Images are limited to ${BUILD_IMAGE_MAX_COUNT}` },
				{ status: 400 },
			);
		}

		const { error } = await supabase
			.from("builds")
			.update({
				preset_code: presetCode,
				postUuid: id,
				youtube_link: payload.youtube_link || null,
				title: payload.title,
				description,
				content: payload.content,
				artifact_values: getArtifactValues(payload.content),
				costume: payload.costume,
				weapon: payload.weapon,
				miracle: payload.miracle,
				combo: payload.combo,
				fruit_skewer: payload.fruit_skewer ?? [],
				ability: payload.ability,
				version: payload.version,
				updated_at: new Date().toISOString(),
				writer: currentBuild.writer,
			})
			.eq("postUuid", id);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		const nextImagePathSet = new Set(nextImagePaths);
		const removedImagePaths = extractBuildImageStoragePaths(
			currentBuild.description,
		).filter((path) => !nextImagePathSet.has(path));
		await removeBuildImages(removedImagePaths, id);

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id }, { status: 200 });
	} catch (error) {
		console.error("PATCH /api/builds/[id] failed", error);
		return NextResponse.json(
			{ message: "Failed to update build" },
			{ status: 500 },
		);
	}
};

export const DELETE = async (_request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Login is required" },
				{ status: 401 },
			);
		}

		const { data: build } = await getBuildDetailCached(id);

		if (!build) {
			return NextResponse.json({ message: "Not found" }, { status: 404 });
		}

		const isOwner = build.writer.uuid === user.id;
		const isAdmin = await isAdminUser(user.id);

		if (!isOwner && !isAdmin) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		const { error } = await supabase.from("builds").delete().eq("postUuid", id);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		await removeBuildImages(
			extractBuildImageStoragePaths(build.description),
			id,
		);

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/builds/[id] failed", error);
		return NextResponse.json(
			{ message: "Failed to delete build" },
			{ status: 500 },
		);
	}
};
