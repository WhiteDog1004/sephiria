import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types_db";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getBuilds = async ({
	...req
}): Promise<Database["public"]["Tables"]["builds"]["Row"][]> => {
	const { title, costume, weapon, miracle } = req;
	const supabase = await createBrowserSupabaseClient();

	let query = supabase
		.from("builds")
		.select("*")
		.order("id", { ascending: true });

	if (title) {
		query = query.ilike("title", `%${title}%`);
	}
	if (costume) {
		query = query.eq("costume", costume);
	}
	if (weapon) {
		query = query.eq("weapon", weapon);
	}
	if (miracle) {
		query = query.eq("miracle", miracle);
	}

	const { data, error } = await query;
	handleError(error);

	return data || [];
};
