import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/src/entities/admin";

export const dynamic = "force-dynamic";

export const GET = async () => {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const isAdmin = await isAdminUser(user?.id);

	return NextResponse.json(
		{ isAdmin },
		{ headers: { "Cache-Control": "private, no-store" } },
	);
};
