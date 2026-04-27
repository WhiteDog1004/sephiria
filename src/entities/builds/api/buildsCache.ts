import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import type {
	BuildRow,
	GetBuildsParams,
	GetBuildsResponse,
} from "../model/builds.types";

export const BUILDS_LIST_TAG = "builds:list";
export const getBuildDetailTag = (postUuid: string) =>
	`builds:detail:${postUuid}`;

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

const getBuildDisplayTime = (
	build: Pick<BuildRow, "created_at" | "updated_at">,
) => new Date(build.updated_at || build.created_at).getTime();

const applyBuildsFilters = <T>(query: T, params: NormalizedBuildsParams): T => {
	let filteredQuery = query as T & {
		ilike: (column: string, pattern: string) => typeof filteredQuery;
		eq: (column: string, value: string) => typeof filteredQuery;
		contains: (column: string, value: string[]) => typeof filteredQuery;
	};

	if (params.isLatestVersion) {
		const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
		const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");
		filteredQuery = filteredQuery.ilike("version", `${currentMajorMinor}.%`);
	}

	if (params.title) {
		if (params.isWriter) {
			filteredQuery = filteredQuery.ilike(
				"writer->>nickname",
				`%${params.title}%`,
			);
		} else {
			filteredQuery = filteredQuery.ilike("title", `%${params.title}%`);
		}
	}

	if (params.costume)
		filteredQuery = filteredQuery.eq("costume", params.costume);
	if (params.weapon) filteredQuery = filteredQuery.eq("weapon", params.weapon);
	if (params.miracle)
		filteredQuery = filteredQuery.eq("miracle", params.miracle);
	if (params.combo)
		filteredQuery = filteredQuery.contains("combo", [params.combo]);

	return filteredQuery;
};

export const normalizeBuildsParams = (
	params: GetBuildsParams,
): NormalizedBuildsParams => {
	const page = Number.isFinite(params.page)
		? Math.max(1, Number(params.page))
		: 1;
	const limit = Number.isFinite(params.limit)
		? Math.max(1, Number(params.limit))
		: 10;

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

const getBuildsFromDb = async (
	params: NormalizedBuildsParams,
): Promise<GetBuildsResponse> => {
	const supabase = await createServerSupabaseAdminClient();
	const from = (params.page - 1) * params.limit;
	const to = from + params.limit - 1;
	const selectColumns =
		"id,postUuid,title,description,costume,weapon,miracle,combo,fruit_skewer,version,content,ability,postLike,created_at,updated_at,writer";

	if (params.like === "asc") {
		const query = applyBuildsFilters(
			supabase.from("builds").select(selectColumns, { count: "exact" }),
			params,
		)
			.order("postLike", { ascending: false, nullsFirst: false })
			.range(from, to);

		const { data, error, count } = await query;
		handleError(error);

		return {
			data: (data as BuildRow[]) ?? [],
			count: count ?? 0,
		};
	}

	const dateQuery = applyBuildsFilters(
		supabase
			.from("builds")
			.select("id,postUuid,created_at,updated_at", { count: "exact" }),
		params,
	);
	const { data: dateData, error: dateError, count } = await dateQuery;
	handleError(dateError);

	const pageIds = (
		(dateData as Pick<
			BuildRow,
			"id" | "postUuid" | "created_at" | "updated_at"
		>[]) ?? []
	)
		.sort(
			(a, b) => getBuildDisplayTime(b) - getBuildDisplayTime(a) || b.id - a.id,
		)
		.slice(from, to + 1)
		.map((build) => build.postUuid);

	if (pageIds.length === 0) {
		return {
			data: [],
			count: count ?? 0,
		};
	}

	const { data, error } = await supabase
		.from("builds")
		.select(selectColumns)
		.in("postUuid", pageIds);
	handleError(error);

	const pageIdOrder = new Map(
		pageIds.map((postUuid, index) => [postUuid, index]),
	);

	return {
		data: ((data as BuildRow[]) ?? []).sort(
			(a, b) =>
				(pageIdOrder.get(a.postUuid) ?? Number.MAX_SAFE_INTEGER) -
				(pageIdOrder.get(b.postUuid) ?? Number.MAX_SAFE_INTEGER),
		),
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
			"id,postUuid,title,costume,weapon,miracle,combo,fruit_skewer,version,content,ability,description,postLike,created_at,updated_at,writer",
		)
		.eq("postUuid", id)
		.single();

	handleError(error);
	return { data: (data as BuildRow | null) ?? null };
};

export const getBuildDetailCached = async (id: string) => {
	return unstable_cache(
		async () => getBuildDetailFromDb(id),
		[`builds:detail:v1:${id}`],
		{
			tags: [getBuildDetailTag(id)],
			revalidate: DETAIL_REVALIDATE_SECONDS,
		},
	)();
};
