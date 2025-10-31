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
	isLatestVersion = false,
	...req
}: {
	page?: number;
	limit?: number;
	like?: "asc" | "desc";
	isLatestVersion?: boolean;
} & Partial<BuildRow>): Promise<GetBuildsResponse> => {
	const { title, costume, weapon, miracle, like } = req;
	const supabase = await createBrowserSupabaseClient();

	const from = (page - 1) * limit;
	const to = from + limit - 1;

	let query = supabase
		.from("builds")
		.select("*", { count: "exact" })
		.range(from, to);

	if (isLatestVersion) {
		const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
		const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");

		query = query.ilike("version", `${currentMajorMinor}.%`);
	}

	if (like && like === "desc") {
		query = query.order("postLike", {
			ascending: like && false,
			nullsFirst: like && false,
		});
	}

	query = query.order("id", { ascending: false });

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
