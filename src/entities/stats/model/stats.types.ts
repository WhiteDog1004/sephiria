export type StatItemType =
	| "costume"
	| "weapon"
	| "miracle"
	| "artifact"
	| "combo"
	| "talent";

export type BuildItemUsageStat = {
	item_type: StatItemType;
	item_value: string;
	build_count: number;
	like_count: number;
	usage_rate: number;
};

export type BuildItemUsageStatsResponse = BuildItemUsageStat[];
