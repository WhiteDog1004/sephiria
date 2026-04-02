import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
	BUILDS_LIST_TAG,
	getBuildDetailTag,
} from "@/src/entities/builds/api/buildsCache";

export const dynamic = "force-dynamic";

type RouteContext = {
	params: Promise<{ id: string }>;
};

export const POST = async (request: Request, context: RouteContext) => {
	try {
		const { id } = await context.params;
		const payload = (await request.json()) as { userId?: string };
		const userId = payload.userId?.trim();

		if (!userId) {
			return NextResponse.json({ message: "userId is required" }, { status: 400 });
		}

		const supabase = await createServerSupabaseClient();
		const { error } = await supabase
			.from("likes")
			.insert([{ post_id: id, user_id: userId }]);

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		revalidateTag(BUILDS_LIST_TAG);
		revalidateTag(getBuildDetailTag(id));

		return NextResponse.json({ postUuid: id, userId }, { status: 201 });
	} catch (error) {
		console.error("POST /api/builds/[id]/like failed", error);
		return NextResponse.json({ message: "Failed to create like" }, { status: 500 });
	}
};

