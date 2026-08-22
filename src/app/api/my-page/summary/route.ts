import { NextResponse } from "next/server";
import {
	createServerSupabaseAdminClient,
	createServerSupabaseClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
	try {
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ message: error?.message ?? "Login is required" },
				{ status: 401 },
			);
		}

		const admin = await createServerSupabaseAdminClient();
		const { data, error: statsError } = await admin
			.from("writer_build_stats")
			.select("build_count,badge_level")
			.eq("user_id", user.id)
			.maybeSingle();

		if (statsError) {
			return NextResponse.json(
				{ message: statsError.message },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				buildCount: data?.build_count ?? 0,
				badgeLevel: data?.badge_level ?? 0,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("GET /api/my-page/summary failed", error);
		return NextResponse.json(
			{ message: "Failed to fetch my page summary" },
			{ status: 500 },
		);
	}
};
