import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import type { WeaponRow } from "@/src/entities/weapon/model/types";
import weaponsJson from "@/src/entities/weapon/model/wepons.json";
import type {
	BuildRow,
	BuildWithLikeStatus,
	GetBuildsParams,
	GetBuildsResponse,
	WriterBuildStatsRow,
} from "../model/builds.types";

export const BUILDS_LIST_TAG = "builds:list";
export const getBuildDetailTag = (postUuid: string) =>
	`builds:detail:${postUuid}`;

const LIST_REVALIDATE_SECONDS = 60 * 60 * 24;
const DETAIL_REVALIDATE_SECONDS = 60 * 60 * 24;

type WeaponStaticRow = WeaponRow & { disabled?: boolean | null };

const WEAPONS = (weaponsJson as WeaponStaticRow[]).filter(
	(weapon) => weapon.disabled !== true,
);

type NormalizedBuildsParams = {
	page: number;
	limit: number;
	isLatestVersion: boolean;
	like: "asc" | "desc";
	isWriter: boolean;
	recentDays: 7 | 30 | null;
	writerUuid: string;
	title: string;
	costume: string;
	weapon: string;
	miracle: string;
	combo: string;
	artifacts: string[];
	likedOnly: boolean;
	likedByUserId: string;
};

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

const getRelatedWeaponValues = (weaponValue: string) => {
	const selectedWeapon = WEAPONS.find((weapon) => weapon.value === weaponValue);
	if (!selectedWeapon) return [weaponValue];

	const values = new Set([selectedWeapon.value]);
	const addChildren = (parentValue: string) => {
		WEAPONS.filter((weapon) => weapon.parent === parentValue).forEach(
			(weapon) => {
				values.add(weapon.value);
				addChildren(weapon.value);
			},
		);
	};

	addChildren(selectedWeapon.value);

	return [...values];
};

const applyBuildsFilters = <T>(query: T, params: NormalizedBuildsParams): T => {
	let filteredQuery = query as T & {
		ilike: (column: string, pattern: string) => typeof filteredQuery;
		eq: (column: string, value: string) => typeof filteredQuery;
		gte: (column: string, value: string) => typeof filteredQuery;
		in: (column: string, values: string[]) => typeof filteredQuery;
		contains: (column: string, value: string[]) => typeof filteredQuery;
	};

	if (params.isLatestVersion) {
		const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
		const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");
		filteredQuery = filteredQuery.ilike("version", `${currentMajorMinor}.%`);
	}

	if (params.recentDays) {
		const createdAfter = new Date();
		createdAfter.setDate(createdAfter.getDate() - params.recentDays);
		filteredQuery = filteredQuery.gte("created_at", createdAfter.toISOString());
	}

	if (params.writerUuid) {
		filteredQuery = filteredQuery.eq("writer->>uuid", params.writerUuid);
	} else if (params.title) {
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
	if (params.weapon)
		filteredQuery = filteredQuery.in(
			"weapon",
			getRelatedWeaponValues(params.weapon),
		);
	if (params.miracle)
		filteredQuery = filteredQuery.eq("miracle", params.miracle);
	if (params.combo)
		filteredQuery = filteredQuery.contains("combo", [params.combo]);
	if (params.artifacts.length > 0)
		filteredQuery = filteredQuery.contains("artifact_values", params.artifacts);

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
		recentDays:
			params.recentDays === 7 || params.recentDays === 30
				? params.recentDays
				: null,
		writerUuid: params.writerUuid?.trim() ?? "",
		title: params.title?.trim() ?? "",
		costume: params.costume?.trim() ?? "",
		weapon: params.weapon?.trim() ?? "",
		miracle: params.miracle?.trim() ?? "",
		combo: params.combo?.trim() ?? "",
		artifacts: [
			...new Set(params.artifacts?.map((artifact) => artifact.trim())),
		]
			.filter(Boolean)
			.slice(0, 5),
		likedOnly: Boolean(params.likedOnly),
		likedByUserId: params.likedByUserId?.trim() ?? "",
	};
};

const addLikeStatus = (
	builds: BuildRow[],
	likedPostIds: string[] | null,
): BuildWithLikeStatus[] => {
	const likedPostIdSet = new Set(likedPostIds ?? []);

	return builds.map((build) => ({
		...build,
		isLiked: likedPostIdSet.has(build.postUuid),
	}));
};

const DEFAULT_WRITER_STATS: Pick<
	WriterBuildStatsRow,
	"build_count" | "badge_level" | "nickname_color"
> = {
	build_count: 0,
	badge_level: 0,
	nickname_color: "default",
};

const attachWriterStats = async (
	builds: BuildWithLikeStatus[],
): Promise<BuildWithLikeStatus[]> => {
	if (builds.length === 0) return builds;

	const writerIds = [
		...new Set(
			builds.map((build) => build.writer.uuid).filter((uuid) => Boolean(uuid)),
		),
	];

	if (writerIds.length === 0) {
		return builds.map((build) => ({
			...build,
			writerStats: DEFAULT_WRITER_STATS,
		}));
	}

	const supabase = await createServerSupabaseAdminClient();
	const { data, error } = await supabase
		.from("writer_build_stats")
		.select("user_id,build_count,badge_level,nickname_color")
		.in("user_id", writerIds);

	handleError(error);

	const statsMap = new Map(
		(data ?? []).map((stats) => [
			stats.user_id,
			{
				build_count: stats.build_count,
				badge_level: stats.badge_level,
				nickname_color: stats.nickname_color,
			},
		]),
	);

	return builds.map((build) => ({
		...build,
		writerStats: statsMap.get(build.writer.uuid) ?? DEFAULT_WRITER_STATS,
	}));
};

const getBuildsFromDb = async (
	params: NormalizedBuildsParams,
): Promise<GetBuildsResponse> => {
	const supabase = await createServerSupabaseAdminClient();
	const from = (params.page - 1) * params.limit;
	const to = from + params.limit - 1;
	const selectColumns =
		"id,postUuid,title,description,costume,weapon,miracle,combo,fruit_skewer,version,content,artifact_values,ability,preset_code,postLike,created_at,updated_at,writer";
	let likedPostIds: string[] | null = null;

	if (params.likedByUserId) {
		const { data: likes, error } = await supabase
			.from("likes")
			.select("post_id")
			.eq("user_id", params.likedByUserId);

		handleError(error);
		likedPostIds = likes?.map((like) => like.post_id).filter(Boolean) ?? [];

		if (params.likedOnly && likedPostIds.length === 0) {
			return {
				data: [],
				count: 0,
			};
		}
	}

	if (params.like === "asc") {
		let query = applyBuildsFilters(
			supabase.from("builds").select(selectColumns, { count: "exact" }),
			params,
		);

		if (params.likedOnly && likedPostIds) {
			query = query.in("postUuid", likedPostIds);
		}

		query = query
			.order("postLike", { ascending: false, nullsFirst: false })
			.range(from, to);

		const { data, error, count } = await query;
		handleError(error);

		const builds = addLikeStatus((data as BuildRow[]) ?? [], likedPostIds);

		return {
			data: await attachWriterStats(builds),
			count: count ?? 0,
		};
	}

	let query = applyBuildsFilters(
		supabase.from("builds").select(selectColumns, { count: "exact" }),
		params,
	);

	if (params.likedOnly && likedPostIds) {
		query = query.in("postUuid", likedPostIds);
	}

	query = query
		.order("display_at", { ascending: false })
		.order("id", { ascending: false })
		.range(from, to);

	const { data, error, count } = await query;
	handleError(error);

	const builds = addLikeStatus((data as BuildRow[]) ?? [], likedPostIds);

	return {
		data: await attachWriterStats(builds),
		count: count ?? 0,
	};
};

const getBuildsCachedFn = unstable_cache(
	async (params: NormalizedBuildsParams) => getBuildsFromDb(params),
	["builds:list:v7"],
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
			"id,postUuid,title,costume,weapon,miracle,combo,fruit_skewer,version,content,artifact_values,ability,description,preset_code,postLike,created_at,updated_at,writer",
		)
		.eq("postUuid", id)
		.single();

	handleError(error);
	const build = (data as BuildRow | null) ?? null;
	const builds = build ? await attachWriterStats([build]) : [];

	return { data: builds[0] ?? null };
};

export const getBuildDetailCached = async (id: string) => {
	return unstable_cache(
		async () => getBuildDetailFromDb(id),
		[`builds:detail:v2:${id}`],
		{
			tags: [getBuildDetailTag(id)],
			revalidate: DETAIL_REVALIDATE_SECONDS,
		},
	)();
};
