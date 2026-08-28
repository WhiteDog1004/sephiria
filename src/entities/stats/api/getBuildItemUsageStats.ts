"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type {
	BuildItemUsageStatsResponse,
	StatItemType,
} from "../model/stats.types";

type BuildItemUsageStatsRow = {
	item_type: StatItemType;
	item_value: string;
	build_count: number | string | null;
	like_count: number | string | null;
	usage_rate: number | string | null;
};

export const getBuildItemUsageStats = async (
	itemType: StatItemType,
): Promise<BuildItemUsageStatsResponse> => {
	const supabase = createBrowserSupabaseClient();
	const { data, error } = await supabase
		.from("build_item_usage_stats")
		.select("item_type,item_value,build_count,like_count,usage_rate")
		.eq("item_type", itemType)
		.gt("build_count", 0)
		.order("build_count", { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as BuildItemUsageStatsRow[]).map((item) => ({
		item_type: item.item_type,
		item_value: item.item_value,
		build_count: Number(item.build_count ?? 0),
		like_count: Number(item.like_count ?? 0),
		usage_rate: Number(item.usage_rate ?? 0),
	}));
};
