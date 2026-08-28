"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuildItemUsageStats } from "../api/getBuildItemUsageStats";
import type { StatItemType } from "./stats.types";

export const useGetBuildItemUsageStats = (itemType: StatItemType) => {
	return useQuery({
		queryKey: ["stats", "build-item-usage", itemType],
		queryFn: () => getBuildItemUsageStats(itemType),
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 30,
	});
};
