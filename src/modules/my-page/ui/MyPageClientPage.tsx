"use client";

import type { User } from "@supabase/supabase-js";
import { FileText, Heart, UserRound } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGetBuilds } from "@/src/entities/builds/model/useGetBuilds";
import { useGetMiracles } from "@/src/entities/builds/model/useGetMiracles";
import { useGetWeapons } from "@/src/entities/builds/model/useGetWeapons";
import { BuildPagination } from "@/src/features/builds/ui/BuildPagination";
import { BuildsCard } from "@/src/modules/builds/ui/BuildsCard";
import { useSession } from "@/src/modules/header/model/useUserInfo";
import { useGetMyPageSummary } from "@/src/modules/my-page/model/useGetMyPageSummary";
import {
	Avatar,
	AvatarImage,
	Box,
	Button,
	Column,
	NotLogin,
	Row,
	Skeleton,
	Typography,
} from "@/src/shared";

const PAGE_SIZE = 6;

type MyPageMenuValue = "written" | "liked";

const MY_PAGE_MENUS: {
	value: MyPageMenuValue;
	label: string;
	description: string;
	icon: typeof FileText;
}[] = [
	{
		value: "written",
		label: "작성한 빌드",
		description: "내가 공유한 빌드를 모아볼 수 있어요.",
		icon: FileText,
	},
	{
		value: "liked",
		label: "좋아요한 빌드",
		description: "나중에 다시 보고 싶은 빌드를 확인해요.",
		icon: Heart,
	},
];

const isMyPageMenuValue = (value: string | null): value is MyPageMenuValue =>
	MY_PAGE_MENUS.some((menu) => menu.value === value);

const getMyPageMenuValue = (value: string | null): MyPageMenuValue =>
	isMyPageMenuValue(value) ? value : "written";

const getMyPagePage = (value: string | null) => {
	const page = Number(value);

	return Number.isFinite(page) && page > 0 ? page : 1;
};

const getDisplayName = (user: User) =>
	user.user_metadata.custom_claims?.global_name ||
	user.user_metadata.full_name ||
	user.user_metadata.name ||
	"세피리아 유저";

const getBadgeSrc = (badgeLevel: number) =>
	`/level/36x36_level_${badgeLevel}.png`;

const BADGE_LEVEL_REQUIREMENTS = [0, 3, 10, 20, 30] as const;

const getBadgeExperience = (badgeLevel: number, buildCount: number) => {
	const currentRequired = BADGE_LEVEL_REQUIREMENTS[badgeLevel] ?? 0;
	const nextRequired = BADGE_LEVEL_REQUIREMENTS[badgeLevel + 1];

	if (nextRequired === undefined) {
		return {
			currentValue: buildCount,
			nextValue: buildCount,
			progress: 100,
			isMaxLevel: true,
		};
	}

	const levelRange = nextRequired - currentRequired;
	const currentProgress = Math.max(0, buildCount - currentRequired);

	return {
		currentValue: buildCount,
		nextValue: nextRequired,
		progress: Math.min(100, Math.round((currentProgress / levelRange) * 100)),
		isMaxLevel: false,
	};
};

const MyPageSummary = () => {
	const { data, isLoading } = useGetMyPageSummary();
	const badgeLevel = data?.badgeLevel ?? 0;
	const buildCount = data?.buildCount ?? 0;
	const experience = getBadgeExperience(badgeLevel, buildCount);

	return (
		<Column className="w-full items-center gap-1 rounded-md border bg-background px-4 py-3 sm:w-40">
			<Image
				src={getBadgeSrc(badgeLevel)}
				alt={`뱃지 ${badgeLevel}단계`}
				width={36}
				height={36}
				className="shrink-0"
				unoptimized
			/>
			{isLoading ? (
				<Column className="w-full items-center gap-1">
					<Skeleton className="h-4 w-16 rounded-md" />
					<Skeleton className="h-4 w-20 rounded-md" />
					<Skeleton className="mt-1 h-2 w-full rounded-full" />
				</Column>
			) : (
				<Column className="w-full items-center gap-1">
					<Typography variant="body2" className="whitespace-nowrap">
						레벨 {badgeLevel}
					</Typography>
					<Typography
						variant="caption"
						className="whitespace-nowrap text-muted-foreground"
					>
						작성글 {buildCount}개
					</Typography>
					<Row className="h-4 w-full items-center overflow-hidden rounded-[2px] border border-black/70 bg-[#3c3c3c] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
						<span className="flex h-full shrink-0 items-center border-r border-black/60 bg-[#777] px-1 text-[9px] leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] [text-shadow:1px_1px_0_#111]">
							EXP.
						</span>
						<div className="relative h-full min-w-0 flex-1 overflow-hidden bg-[linear-gradient(180deg,#666,#303030_55%,#1d1d1d)]">
							<div
								className="h-full border-r border-[#d9ff75] bg-[linear-gradient(180deg,#dfff55_0%,#8beb12_45%,#52b500_55%,#b7ff21_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-all"
								style={{ width: `${experience.progress}%` }}
							/>
							<span className="absolute inset-y-0 right-1 flex items-center text-[9px] leading-none text-white [text-shadow:1px_1px_0_#111]">
								{experience.isMaxLevel
									? "MAX"
									: `${experience.currentValue}/${experience.nextValue}`}
							</span>
						</div>
					</Row>
				</Column>
			)}
		</Column>
	);
};

export const MyPageLoading = () => (
	<Column className="w-full items-center px-3 pt-3 pb-8 md:px-6 md:pt-6 md:pb-16">
		<Column className="w-full max-w-7xl gap-6">
			<Skeleton className="h-40 w-full rounded-md" />
			<Row className="w-full gap-6">
				<Skeleton className="hidden h-72 w-56 rounded-md lg:block" />
				<Column className="w-full gap-4">
					<Skeleton className="h-12 w-full rounded-md" />
					<Skeleton className="h-52 w-full rounded-md" />
					<Skeleton className="h-52 w-full rounded-md" />
				</Column>
			</Row>
		</Column>
	</Column>
);

const EmptyBuilds = ({ type }: { type: MyPageMenuValue }) => (
	<Column className="w-full items-center justify-center gap-5 rounded-md border bg-card py-16 text-center">
		<Image src="/white-wolf.png" alt="empty" width={132} height={132} />
		<Column className="gap-2">
			<Typography variant="header3" className="text-secondary-foreground">
				{type === "written"
					? "아직 작성한 빌드가 없어요."
					: "아직 좋아요한 빌드가 없어요."}
			</Typography>
			<Typography variant="body2" className="text-muted-foreground">
				{type === "written"
					? "빌드공유에서 첫 빌드를 등록해 보세요."
					: "마음에 드는 빌드를 찾으면 좋아요로 저장할 수 있어요."}
			</Typography>
		</Column>
	</Column>
);

const MyBuildsSection = ({
	type,
	userId,
	page,
	onPageChange,
}: {
	type: MyPageMenuValue;
	userId: string;
	page: number;
	onPageChange: (page: number) => void;
}) => {
	const { data, isLoading, isFetching } = useGetBuilds({
		page,
		limit: PAGE_SIZE,
		like: "desc",
		writerUuid: type === "written" ? userId : undefined,
		likedOnly: type === "liked",
	});
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();
	const isBuildListLoading = isLoading || (isFetching && !data);
	const totalPage = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;

	if (isBuildListLoading) {
		return (
			<Column className="w-full gap-4">
				<Skeleton className="h-52 w-full rounded-md" />
				<Skeleton className="h-52 w-full rounded-md" />
				<Skeleton className="h-52 w-full rounded-md" />
			</Column>
		);
	}

	if (!data?.data.length) {
		return <EmptyBuilds type={type} />;
	}

	return (
		<Column className="w-full items-center gap-6">
			<Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 p-0 lg:grid-cols-[repeat(auto-fill,minmax(460px,1fr))]">
				{data.data.map((build) => (
					<BuildsCard
						key={build.postUuid}
						data={build}
						weapon={weapons?.find((weapon) => weapon.value === build.weapon)}
						miracle={miracles?.find(
							(miracle) => miracle.value === build.miracle,
						)}
						hideArtifactSummary
					/>
				))}
			</Box>
			{totalPage > 1 && (
				<BuildPagination
					page={page}
					setPage={(value) => onPageChange(value as number)}
					totalPage={totalPage}
				/>
			)}
		</Column>
	);
};

export const MyPageClientPage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { data: session, isLoading } = useSession();
	const selectedMenu = getMyPageMenuValue(searchParams.get("tab"));
	const page = getMyPagePage(searchParams.get("page"));

	if (isLoading) return <MyPageLoading />;
	if (!session) return <NotLogin />;

	const user = session.user;
	const displayName = getDisplayName(user);
	const activeMenu = MY_PAGE_MENUS.find((menu) => menu.value === selectedMenu);
	const updateMyPageQuery = (
		nextMenu: MyPageMenuValue,
		nextPage: number,
		method: "push" | "replace",
	) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", nextMenu);

		if (nextPage > 1) {
			params.set("page", String(nextPage));
		} else {
			params.delete("page");
		}

		router[method](`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<Column className="w-full items-center px-3 pt-3 pb-8 md:px-6 md:pt-6 md:pb-16">
			<Column className="w-full max-w-7xl gap-6">
				<Row className="w-full flex-col gap-4 rounded-md border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
					<Row className="items-center gap-4">
						<Avatar className="size-16 border">
							<AvatarImage src={user.user_metadata.avatar_url} />
						</Avatar>
						<Column className="min-w-0 gap-1">
							<Typography variant="caption" className="text-muted-foreground">
								마이페이지
							</Typography>
							<Typography variant="header2" className="truncate">
								{displayName}
							</Typography>
							<Typography variant="body2" className="text-muted-foreground">
								내 빌드 활동을 한 곳에서 확인해요.
							</Typography>
						</Column>
					</Row>
					<MyPageSummary />
				</Row>

				<Row className="w-full flex-col items-start gap-6 lg:flex-row">
					<Column className="w-full shrink-0 gap-2 rounded-md border bg-card p-2 shadow-sm lg:w-48">
						{MY_PAGE_MENUS.map((menu) => {
							const Icon = menu.icon;
							const isActive = selectedMenu === menu.value;

							return (
								<Button
									key={menu.value}
									type="button"
									variant="ghost"
									onClick={() => updateMyPageQuery(menu.value, 1, "replace")}
									className={cn(
										"h-auto w-full justify-start rounded-md px-3 py-3 text-left",
										isActive && "bg-accent text-accent-foreground",
									)}
								>
									<Icon className="size-4" />
									<Column className="min-w-0 gap-1">
										<Typography variant="body2">{menu.label}</Typography>
										<Typography
											variant="caption"
											className="hidden whitespace-normal text-muted-foreground sm:block"
										>
											{menu.description}
										</Typography>
									</Column>
								</Button>
							);
						})}
					</Column>

					<Column className="w-full min-w-0 gap-4">
						<Row className="w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<Column className="gap-1">
								<Row className="items-center gap-2">
									<UserRound className="size-5 text-muted-foreground" />
									<Typography variant="header2">{activeMenu?.label}</Typography>
								</Row>
								<Typography variant="body2" className="text-muted-foreground">
									{activeMenu?.description}
								</Typography>
							</Column>
						</Row>

						<MyBuildsSection
							key={selectedMenu}
							type={selectedMenu}
							userId={user.id}
							page={page}
							onPageChange={(nextPage) =>
								updateMyPageQuery(selectedMenu, nextPage, "push")
							}
						/>
					</Column>
				</Row>
			</Column>
		</Column>
	);
};
