"use client";

import { BarChart3, ExternalLink, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import artifactsJson from "@/src/entities/artifact/model/artifacts.json";
import costumesJson from "@/src/entities/costume/model/costumes.json";
import miraclesJson from "@/src/entities/miracle/model/miracles.json";
import type { MiracleRow } from "@/src/entities/miracle/model/types";
import type { BuildItemUsageStat, StatItemType } from "@/src/entities/stats";
import { useGetBuildItemUsageStats } from "@/src/entities/stats";
import type { WeaponRow } from "@/src/entities/weapon/model/types";
import weaponsJson from "@/src/entities/weapon/model/wepons.json";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Column,
	Row,
	Separator,
	SITEMAP,
	Tabs,
	TabsList,
	TabsTrigger,
	Typography,
} from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { COSTUMES } from "@/src/shared/config/costumes";

type ItemMeta = {
	label: string;
	image?: string | null;
};

type CostumeRow = {
	value: string;
	image: string;
};

type ArtifactRow = {
	value: string;
	label_kor: string;
	image: string;
	disabled?: boolean | null;
};

type StatTab = {
	value: StatItemType;
	label: string;
	buildSearchKey?: "costume" | "weapon" | "miracle" | "combo" | "artifacts";
};

const STAT_TABS: StatTab[] = [
	{ value: "costume", label: "캐릭터", buildSearchKey: "costume" },
	{ value: "weapon", label: "무기", buildSearchKey: "weapon" },
	{ value: "miracle", label: "기적", buildSearchKey: "miracle" },
	{ value: "artifact", label: "아티팩트", buildSearchKey: "artifacts" },
	{ value: "talent", label: "재능" },
	{ value: "combo", label: "콤보", buildSearchKey: "combo" },
];
const HIDE_LEAST_USED_CHART_TYPES: StatItemType[] = ["artifact", "talent"];

const TALENT_META: Record<string, ItemMeta> = {
	anger: { label: "분노", image: "/talent/anger_20.png" },
	rapid: { label: "신속", image: "/talent/rapid_20.png" },
	survival: { label: "생존", image: "/talent/survival_20.png" },
	patience: { label: "인내", image: "/talent/patience_20.png" },
	wisdom: { label: "지혜", image: "/talent/wisdom_20.png" },
	will: { label: "의지", image: "/talent/will_20.png" },
	base: { label: "기본", image: "/talent/base_20.png" },
};

const formatItemValue = (value: string) =>
	value
		.split("_")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const getBuildSearchHref = (tab: StatTab, value: string) => {
	if (!tab.buildSearchKey) return SITEMAP.BUILDS;

	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
	});

	params.append(tab.buildSearchKey, value);

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};

const createItemMetaMap = (itemType: StatItemType) => {
	const map = new Map<string, ItemMeta>();

	if (itemType === "costume") {
		(costumesJson as CostumeRow[]).forEach((item) => {
			map.set(item.value, {
				label: COSTUMES[item.value]?.name ?? formatItemValue(item.value),
				image: item.image,
			});
		});
	}

	if (itemType === "weapon") {
		(weaponsJson as (WeaponRow & { disabled?: boolean | null })[])
			.filter((item) => item.disabled !== true)
			.forEach((item) => {
				map.set(item.value, {
					label: item.value_kor || formatItemValue(item.value),
					image: item.image,
				});
			});
	}

	if (itemType === "miracle") {
		(miraclesJson as MiracleRow[]).forEach((item) => {
			map.set(item.value, {
				label: item.value_kor || formatItemValue(item.value),
				image: item.image,
			});
		});
	}

	if (itemType === "artifact") {
		(artifactsJson as ArtifactRow[])
			.filter((item) => item.disabled !== true)
			.forEach((item) => {
				map.set(item.value, {
					label: item.label_kor || formatItemValue(item.value),
					image: item.image,
				});
			});
	}

	if (itemType === "combo") {
		Object.entries(EFFECT_LABELS).forEach(([key, label]) => {
			map.set(key, {
				label: label || formatItemValue(key),
				image: `/combo/${key}.png`,
			});
		});
	}

	if (itemType === "talent") {
		Object.entries(TALENT_META).forEach(([key, meta]) => map.set(key, meta));
	}

	return map;
};

const StatItemImage = ({
	meta,
	label,
	size = 56,
}: {
	meta?: ItemMeta;
	label: string;
	size?: number;
}) => {
	if (!meta?.image) {
		return (
			<div
				className="grid shrink-0 place-items-center rounded-md border bg-muted text-sm font-semibold"
				style={{ width: size, height: size }}
			>
				{label.slice(0, 1)}
			</div>
		);
	}

	return (
		<Image
			src={meta.image}
			alt={label}
			width={size}
			height={size}
			unoptimized
			className="shrink-0 rounded-md border bg-background object-contain p-1"
			style={{ width: size, height: size }}
		/>
	);
};

const SummaryCard = ({
	title,
	item,
	meta,
	tab,
}: {
	title: string;
	item?: BuildItemUsageStat;
	meta?: ItemMeta;
	tab: StatTab;
}) => {
	if (!item) {
		return (
			<Card className="min-h-36 w-full md:max-w-md">
				<CardHeader>
					<CardTitle className="text-base">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<Typography variant="body2" className="text-muted-foreground">
						아직 통계 데이터가 없습니다.
					</Typography>
				</CardContent>
			</Card>
		);
	}

	const label = meta?.label ?? formatItemValue(item.item_value);

	return (
		<Card className="min-h-36 w-full md:max-w-md">
			<CardHeader className="pb-3">
				<Row className="items-center justify-between gap-2">
					<CardTitle className="text-base">{title}</CardTitle>
					<Trophy className="size-5 text-amber-500" />
				</Row>
			</CardHeader>
			<CardContent>
				<Row className="items-center justify-between gap-4">
					<Row className="min-w-0 items-center gap-3">
						<StatItemImage meta={meta} label={label} />
						<Column className="min-w-0 items-start gap-1 p-0">
							<Typography className="max-w-full truncate font-semibold">
								{label}
							</Typography>
							<Row className="flex-nowrap gap-2">
								<Badge
									variant="secondary"
									className="shrink-0 whitespace-nowrap"
								>
									{item.build_count}회 사용
								</Badge>
								<Badge variant="outline" className="shrink-0 whitespace-nowrap">
									{item.usage_rate}%
								</Badge>
							</Row>
						</Column>
					</Row>
					<Button asChild size="icon" variant="ghost" title="관련 빌드 보기">
						<Link href={getBuildSearchHref(tab, item.item_value)}>
							<ExternalLink />
						</Link>
					</Button>
				</Row>
			</CardContent>
		</Card>
	);
};

const UsageChart = ({
	title,
	description,
	items,
	metaMap,
	tab,
}: {
	title: string;
	description: string;
	items: BuildItemUsageStat[];
	metaMap: Map<string, ItemMeta>;
	tab: StatTab;
}) => {
	const maxCount = Math.max(...items.map((item) => item.build_count), 0);
	const chartItems = items.slice(0, 8);

	if (chartItems.length === 0) {
		return (
			<Column className="min-h-72 w-full items-center justify-center gap-3 rounded-lg border bg-card p-6">
				<BarChart3 className="size-10 text-muted-foreground" />
				<Typography variant="body2" className="text-muted-foreground">
					표시할 통계 데이터가 없습니다.
				</Typography>
			</Column>
		);
	}

	return (
		<Column className="w-full gap-4 rounded-lg border bg-card p-4 md:p-6">
			<Row className="items-center justify-between gap-3">
				<Column className="items-start gap-1 p-0">
					<Typography variant="header3">{title}</Typography>
					<Typography variant="body2" className="text-muted-foreground">
						{description}
					</Typography>
				</Column>
				<Badge variant="outline">총 {items.length}개 항목</Badge>
			</Row>
			<div className="grid w-full grid-cols-[40px_1fr] gap-3">
				<div className="flex flex-col">
					<div className="h-6" />
					<div className="flex h-[200px] flex-col justify-between border-r pr-2 text-right text-xs text-muted-foreground">
						<span>{maxCount}</span>
						<span>{Math.round(maxCount / 2)}</span>
						<span>0</span>
					</div>
				</div>
				<div className="flex items-start gap-2 overflow-x-auto pb-0">
					{chartItems.map((item) => {
						const meta = metaMap.get(item.item_value);
						const label = meta?.label ?? formatItemValue(item.item_value);
						const height = maxCount
							? Math.max((item.build_count / maxCount) * 100, 4)
							: 4;

						return (
							<Link
								key={`${item.item_type}-${item.item_value}`}
								href={getBuildSearchHref(tab, item.item_value)}
								className="group flex min-w-20 flex-1 flex-col items-center gap-2"
								title={`${label}: ${item.build_count}회`}
							>
								<div className="flex h-[224px] w-full items-end justify-center border-b pt-6">
									<div
										className="relative flex w-12 items-start justify-center rounded-t-md border border-red-500 bg-red-500/15 transition group-hover:bg-red-500/30 md:w-16"
										style={{ height: `${height}%` }}
									>
										<span className="absolute -top-5 whitespace-nowrap text-xs font-semibold">
											{item.build_count}
										</span>
									</div>
								</div>
								<StatItemImage meta={meta} label={label} size={36} />
								<Typography
									variant="caption"
									className="line-clamp-2 min-h-8 w-20 break-keep text-center leading-4"
								>
									{label}
								</Typography>
							</Link>
						);
					})}
				</div>
			</div>
		</Column>
	);
};

export const StatsClientPage = () => {
	const [selectedType, setSelectedType] = useState<StatItemType>("costume");
	const selectedTab =
		STAT_TABS.find((tab) => tab.value === selectedType) ?? STAT_TABS[0];
	const {
		data = [],
		isLoading,
		isError,
		error,
	} = useGetBuildItemUsageStats(selectedType);
	const metaMap = useMemo(
		() => createItemMetaMap(selectedType),
		[selectedType],
	);
	const mostUsed = data[0];
	const leastUsed = data[data.length - 1];
	const shouldShowLeastUsedChart =
		!HIDE_LEAST_USED_CHART_TYPES.includes(selectedType);
	const leastUsedItems = useMemo(
		() => [...data].sort((a, b) => a.build_count - b.build_count),
		[data],
	);

	return (
		<Column className="w-full items-center gap-8 px-3 pt-3 pb-8 md:px-6 md:pt-6 md:pb-16">
			<SectionHeader
				imageName="build"
				title="빌드 통계"
				description="빌드 공유기준으로 통계한 기록들을 확인해보세요."
				className="w-full max-w-7xl"
			/>
			<Column className="w-full max-w-7xl gap-5 p-0">
				<Tabs
					value={selectedType}
					onValueChange={(value) => setSelectedType(value as StatItemType)}
					className="w-full gap-5"
				>
					<TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0 dark:bg-transparent">
						{STAT_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="min-h-9 flex-none cursor-pointer border px-4 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				{isError ? (
					<Column className="min-h-72 w-full items-center justify-center gap-3 rounded-lg border bg-card p-6">
						<Typography variant="header3">
							통계를 불러오지 못했습니다.
						</Typography>
						<Typography variant="body2" className="text-muted-foreground">
							{error instanceof Error
								? error.message
								: "Supabase View를 확인해주세요."}
						</Typography>
					</Column>
				) : isLoading ? (
					<Column className="min-h-72 w-full items-center justify-center rounded-lg border bg-card p-6">
						<Typography variant="body2" className="text-muted-foreground">
							통계를 불러오는 중입니다...
						</Typography>
					</Column>
				) : (
					<>
						<div className="flex w-full flex-wrap gap-4">
							<SummaryCard
								title={`제일 많이 사용된 ${selectedTab.label}`}
								item={mostUsed}
								meta={mostUsed ? metaMap.get(mostUsed.item_value) : undefined}
								tab={selectedTab}
							/>
							<SummaryCard
								title={`제일 적게 사용된 ${selectedTab.label}`}
								item={leastUsed}
								meta={leastUsed ? metaMap.get(leastUsed.item_value) : undefined}
								tab={selectedTab}
							/>
						</div>
						<Separator />
						<Column className="w-full gap-6 p-0">
							<UsageChart
								title={`많이 사용된 ${selectedTab.label} 순위`}
								description={`상위 ${Math.min(data.length, 8)}개 항목 기준`}
								items={data}
								metaMap={metaMap}
								tab={selectedTab}
							/>
							{shouldShowLeastUsedChart && (
								<UsageChart
									title={`적게 사용된 ${selectedTab.label} 순위`}
									description={`하위 ${Math.min(leastUsedItems.length, 8)}개 항목 기준`}
									items={leastUsedItems}
									metaMap={metaMap}
									tab={selectedTab}
								/>
							)}
						</Column>
					</>
				)}
			</Column>
		</Column>
	);
};
