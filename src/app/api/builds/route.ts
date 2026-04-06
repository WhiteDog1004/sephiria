import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
	BUILDS_LIST_TAG,
	getBuildDetailTag,
	getBuildsCached,
} from "@/src/entities/builds/api/buildsCache";
import type { CreateBuildType } from "@/src/entities/add-build/model/createBuild.types";
import type { GetBuildsParams } from "@/src/entities/builds/model/builds.types";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const params: GetBuildsParams = {
			page: Number(searchParams.get("page") ?? 1),
			limit: Number(searchParams.get("limit") ?? 10),
			like: searchParams.get("like") === "asc" ? "asc" : "desc",
			isLatestVersion: searchParams.get("isLatestVersion") === "true",
			isWriter: searchParams.get("isWriter") === "true",
			title: searchParams.get("title") ?? undefined,
			costume: searchParams.get("costume") ?? undefined,
			weapon: searchParams.get("weapon") ?? undefined,
			miracle: searchParams.get("miracle") ?? undefined,
			combo: searchParams.get("combo") ?? undefined,
		};

		const result = await getBuildsCached(params);
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("GET /api/builds failed", error);
		return NextResponse.json({ message: "Failed to fetch builds" }, { status: 500 });
	}
};

export const POST = async (request: Request) => {
	try {
		const payload = (await request.json()) as CreateBuildType;
		const supabase = await createServerSupabaseClient();

		const { error } = await supabase.from("builds").insert({
			postUuid: payload.postUuid,
			youtube_link: payload.youtube_link || null,
			title: payload.title,
			description: payload.description,
			content: payload.content,
			costume: payload.costume,
			weapon: payload.weapon,
			miracle: payload.miracle,
			combo: payload.combo,
			fruit_skewer: payload.fruit_skewer ?? [],
			ability: payload.ability,
			version: payload.version,
			writer: payload.writer,
		});

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(payload.postUuid));

		return NextResponse.json({ postUuid: payload.postUuid }, { status: 201 });
	} catch (error) {
		console.error("POST /api/builds failed", error);
		return NextResponse.json({ message: "Failed to create build" }, { status: 500 });
	}
};
