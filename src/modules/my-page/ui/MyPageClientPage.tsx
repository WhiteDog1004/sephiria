"use client";

import type { User } from "@supabase/supabase-js";
import { FileText, Heart, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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

const getDisplayName = (user: User) =>
	user.user_metadata.custom_claims?.global_name ||
	user.user_metadata.full_name ||
	user.user_metadata.name ||
	"세피리아 유저";

const getBadgeSrc = (badgeLevel: number) =>
	`/level/36x36_level_${badgeLevel}.png`;

const MyPageSummary = () => {
	const { data, isLoading } = useGetMyPageSummary();
	const badgeLevel = data?.badgeLevel ?? 0;

	return (
		<Column className="w-full items-center gap-2 rounded-md border bg-background px-4 py-3 sm:w-36">
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
				</Column>
			) : (
				<Column className="items-center gap-1">
					<Typography variant="body2" className="whitespace-nowrap">
						레벨 {badgeLevel}
					</Typography>
					<Typography
						variant="caption"
						className="whitespace-nowrap text-muted-foreground"
					>
						작성글 {data?.buildCount ?? 0}개
					</Typography>
				</Column>
			)}
		</Column>
	);
};

const MyPageLoading = () => (
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
}: {
	type: MyPageMenuValue;
	userId: string;
}) => {
	const [page, setPage] = useState(1);
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
					setPage={(value) => setPage(value as number)}
					totalPage={totalPage}
				/>
			)}
		</Column>
	);
};

export const MyPageClientPage = () => {
	const [selectedMenu, setSelectedMenu] = useState<MyPageMenuValue>("written");
	const { data: session, isLoading } = useSession();

	if (isLoading) return <MyPageLoading />;
	if (!session) return <NotLogin />;

	const user = session.user;
	const displayName = getDisplayName(user);
	const activeMenu = MY_PAGE_MENUS.find((menu) => menu.value === selectedMenu);

	return (
		<Column className="w-full items-center px-3 pt-3 pb-8 md:px-6 md:pt-6 md:pb-16">
			<Column className="w-full max-w-7xl gap-6">
				<Row className="w-full flex-col gap-4 rounded-md border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
									onClick={() => setSelectedMenu(menu.value)}
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
						/>
					</Column>
				</Row>
			</Column>
		</Column>
	);
};
