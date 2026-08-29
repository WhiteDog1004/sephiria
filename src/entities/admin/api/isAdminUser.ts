import { createServerSupabaseAdminClient } from "@/lib/supabase/server";

export const isAdminUser = async (userId?: string | null) => {
	if (!userId) return false;

	const supabase = await createServerSupabaseAdminClient();
	const { data, error } = await supabase
		.from("admin_users")
		.select("user_id")
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		console.error("Failed to check admin user", error);
		return false;
	}

	return Boolean(data);
};
