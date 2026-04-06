import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
	BUILDS_LIST_TAG,
	getBuildDetailCached,
	getBuildDetailTag,
} from "@/src/entities/builds/api/buildsCache";
import type { UpdateBuildType } from "@/src/entities/modify-build/model/updateBuild.types";

export const dynamic = "force-dynamic";

type RouteContext = {
	params: Promise<{ id: string }>;
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
		return NextResponse.json({ message: "Failed to fetch build detail" }, { status: 500 });
	}
};

export const PATCH = async (request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const payload = (await request.json()) as UpdateBuildType;
		const supabase = await createServerSupabaseClient();

		const { error } = await supabase
			.from("builds")
			.update({
				postUuid: id,
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
				updated_at: new Date().toISOString(),
				writer: payload.writer,
			})
			.eq("postUuid", id);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id }, { status: 200 });
	} catch (error) {
		console.error("PATCH /api/builds/[id] failed", error);
		return NextResponse.json({ message: "Failed to update build" }, { status: 500 });
	}
};

export const DELETE = async (_request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const supabase = await createServerSupabaseClient();

		const { error } = await supabase.from("builds").delete().eq("postUuid", id);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/builds/[id] failed", error);
		return NextResponse.json({ message: "Failed to delete build" }, { status: 500 });
	}
};
