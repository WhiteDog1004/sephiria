import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { BuildRow, GetBuildsResponse } from "../model/builds.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getBuilds = async ({
	page = 1,
	limit = 10,
	...req
}: {
	page?: number;
	limit?: number;
	like?: "asc" | "desc";
} & Partial<BuildRow>): Promise<GetBuildsResponse> => {
	const { title, costume, weapon, miracle, like } = req;
	const supabase = await createBrowserSupabaseClient();

	const from = (page - 1) * limit;
	const to = from + limit - 1;

	let query = supabase
		.from("builds")
		.select("*", { count: "exact" })
		.range(from, to)
		.order("postLike", {
			ascending: like && like === "asc",
			nullsFirst: like && like === "asc",
		})
		.order("id", { ascending: false });

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

	const { data, error, count } = await query;
	handleError(error);

	return {
		data: data || [],
		count: count ?? 0,
	};
};
