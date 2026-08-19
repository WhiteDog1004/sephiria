import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
	createServerSupabaseAdminClient,
	createServerSupabaseClient,
} from "@/lib/supabase/server";
import {
	BUILDS_LIST_TAG,
	getBuildDetailTag,
} from "@/src/entities/builds/api/buildsCache";

export const dynamic = "force-dynamic";

type RouteContext = {
	params: Promise<{ id: string }>;
};

const syncBuildLikeCount = async (postUuid: string) => {
	const adminSupabase = await createServerSupabaseAdminClient();
	const { count, error: countError } = await adminSupabase
		.from("likes")
		.select("id", { count: "exact", head: true })
		.eq("post_id", postUuid);

	if (countError) {
		throw countError;
	}

	const postLike = count ?? 0;
	const { error: updateError } = await adminSupabase
		.from("builds")
		.update({ postLike })
		.eq("postUuid", postUuid);

	if (updateError) {
		throw updateError;
	}

	return postLike;
};

export const GET = async (_request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ liked: false });
		}

		const adminSupabase = await createServerSupabaseAdminClient();
		const { data, error } = await adminSupabase
			.from("likes")
			.select("id")
			.eq("post_id", id)
			.eq("user_id", user.id)
			.maybeSingle();

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		return NextResponse.json({ liked: Boolean(data) });
	} catch (error) {
		console.error("GET /api/builds/[id]/like failed", error);
		return NextResponse.json({ message: "Failed to get like" }, { status: 500 });
	}
};

export const POST = async (request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ message: "Login is required" }, { status: 401 });
		}

		const adminSupabase = await createServerSupabaseAdminClient();
		const { error } = await adminSupabase
			.from("likes")
			.insert([{ post_id: id, user_id: user.id }]);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		const postLike = await syncBuildLikeCount(id);

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json(
			{ postUuid: id, userId: user.id, postLike },
			{ status: 201 },
		);
	} catch (error) {
		console.error("POST /api/builds/[id]/like failed", error);
		return NextResponse.json({ message: "Failed to create like" }, { status: 500 });
	}
};

export const DELETE = async (request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ message: "Login is required" }, { status: 401 });
		}

		const adminSupabase = await createServerSupabaseAdminClient();
		const { error } = await adminSupabase
			.from("likes")
			.delete()
			.eq("post_id", id)
			.eq("user_id", user.id);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		const postLike = await syncBuildLikeCount(id);

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id, userId: user.id, postLike });
	} catch (error) {
		console.error("DELETE /api/builds/[id]/like failed", error);
		return NextResponse.json({ message: "Failed to delete like" }, { status: 500 });
	}
};
