import "server-only";

import { unstable_cache } from "next/cache";
import type { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import type { BuildRow, GetBuildsParams, GetBuildsResponse } from "../model/builds.types";

export const BUILDS_LIST_TAG = "builds:list";
export const getBuildDetailTag = (postUuid: string) => `builds:detail:${postUuid}`;

const LIST_REVALIDATE_SECONDS = 60 * 60 * 24;
const DETAIL_REVALIDATE_SECONDS = 60 * 60 * 24;

type NormalizedBuildsParams = {
	page: number;
	limit: number;
	isLatestVersion: boolean;
	like: "asc" | "desc";
	isWriter: boolean;
	title: string;
	costume: string;
	weapon: string;
	miracle: string;
	combo: string;
};

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const normalizeBuildsParams = (params: GetBuildsParams): NormalizedBuildsParams => {
	const page = Number.isFinite(params.page) ? Math.max(1, Number(params.page)) : 1;
	const limit = Number.isFinite(params.limit) ? Math.max(1, Number(params.limit)) : 10;

	return {
		page,
		limit,
		isLatestVersion: Boolean(params.isLatestVersion),
		like: params.like === "asc" ? "asc" : "desc",
		isWriter: Boolean(params.isWriter),
		title: params.title?.trim() ?? "",
		costume: params.costume?.trim() ?? "",
		weapon: params.weapon?.trim() ?? "",
		miracle: params.miracle?.trim() ?? "",
		combo: params.combo?.trim() ?? "",
	};
};

const getBuildsFromDb = async (params: NormalizedBuildsParams): Promise<GetBuildsResponse> => {
	const supabase = await createServerSupabaseAdminClient();
	const from = (params.page - 1) * params.limit;
	const to = from + params.limit - 1;

	let query = supabase
		.from("builds")
		.select(
			"id,postUuid,title,description,costume,weapon,miracle,combo,version,content,ability,postLike,created_at,updated_at,writer",
			{ count: "exact" },
		)
		.range(from, to);

	if (params.isLatestVersion) {
		const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
		const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");
		query = query.ilike("version", `${currentMajorMinor}.%`);
	}

	if (params.like === "asc") {
		query = query.order("postLike", { ascending: false, nullsFirst: false });
	} else {
		query = query.order("id", { ascending: false });
	}

	if (params.title) {
		if (params.isWriter) {
			query = query.ilike("writer->>nickname", `%${params.title}%`);
		} else {
			query = query.ilike("title", `%${params.title}%`);
		}
	}

	if (params.costume) query = query.eq("costume", params.costume);
	if (params.weapon) query = query.eq("weapon", params.weapon);
	if (params.miracle) query = query.eq("miracle", params.miracle);
	if (params.combo) query = query.contains("combo", [params.combo]);

	const { data, error, count } = await query;
	handleError(error);

	return {
		data: (data as BuildRow[]) ?? [],
		count: count ?? 0,
	};
};

const getBuildsCachedFn = unstable_cache(
	async (params: NormalizedBuildsParams) => getBuildsFromDb(params),
	["builds:list:v1"],
	{
		tags: [BUILDS_LIST_TAG],
		revalidate: LIST_REVALIDATE_SECONDS,
	},
);

export const getBuildsCached = async (params: GetBuildsParams) => {
	return getBuildsCachedFn(normalizeBuildsParams(params));
};

const getBuildDetailFromDb = async (id: string) => {
	const supabase = await createServerSupabaseAdminClient();
	const { data, error } = await supabase
		.from("builds")
		.select(
			"id,postUuid,title,costume,weapon,miracle,combo,version,content,ability,description,postLike,created_at,updated_at,writer",
		)
		.eq("postUuid", id)
		.single();

	handleError(error);
	return { data: (data as BuildRow | null) ?? null };
};

export const getBuildDetailCached = async (id: string) => {
	return unstable_cache(async () => getBuildDetailFromDb(id), [`builds:detail:v1:${id}`], {
		tags: [getBuildDetailTag(id)],
		revalidate: DETAIL_REVALIDATE_SECONDS,
	})();
};
