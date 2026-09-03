"use client";

import {
	BarChart3,
	CircleHelpIcon,
	FilePlus2,
	RotateCw,
	Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGetArtifacts } from "@/src/entities/builds/model/useGetArtifacts";
import { useGetBuilds } from "@/src/entities/builds/model/useGetBuilds";
import { useGetMiracles } from "@/src/entities/builds/model/useGetMiracles";
import { useGetWeapons } from "@/src/entities/builds/model/useGetWeapons";
import { useBuildSearchStore } from "@/src/features/builds/model/buildSearchStore";
import { BuildPagination } from "@/src/features/builds/ui/BuildPagination";
import { BuildSearchButton } from "@/src/features/builds/ui/BuildSearchButton";
import {
	AdSenseHorizontal,
	Box,
	Button,
	Checkbox,
	Column,
	Label,
	RequireLoginDialog,
	Row,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	SITEMAP,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { useSession } from "../../header/model/useUserInfo";
import { useSyncBuildQueryState } from "../model/useSyncBuildQueryState";
import { BuildsCard } from "./BuildsCard";

const PAGE_SIZE = 10;
const BUILD_LIST_LOADING_IMAGES = [
	"/face/FaceChip_Player_WhiteWolf.png",
	"/face/FaceChip_Player_Adventurer.png",
	"/face/FaceChip_Player_Armored.png",
	"/face/FaceChip_Player_Fox.png",
	"/face/FaceChip_Player_Holy.png",
	"/face/FaceChip_Player_Mage.png",
	"/face/FaceChip_Player_RedHoly.png",
	"/face/FaceChip_Player_Skeleton.png",
];
const BUILD_LIST_LOADING_FALLBACK_IMAGE = "/face/FaceChip_Player_WhiteWolf.png";

const getRandomLoadingImageIndex = () =>
	Math.floor(Math.random() * BUILD_LIST_LOADING_IMAGES.length);

const getRandomLoadingImage = () =>
	BUILD_LIST_LOADING_IMAGES[getRandomLoadingImageIndex()] ??
	BUILD_LIST_LOADING_FALLBACK_IMAGE;

const getNextLoadingImage = (currentImage: string) => {
	if (BUILD_LIST_LOADING_IMAGES.length <= 1) {
		return BUILD_LIST_LOADING_IMAGES[0] ?? BUILD_LIST_LOADING_FALLBACK_IMAGE;
	}

	const nextIndex = getRandomLoadingImageIndex();
	const nextImage = BUILD_LIST_LOADING_IMAGES[nextIndex];
	if (nextImage && nextImage !== currentImage) return nextImage;

	const currentIndex = BUILD_LIST_LOADING_IMAGES.indexOf(currentImage);
	return (
		BUILD_LIST_LOADING_IMAGES[
			(currentIndex + 1) % BUILD_LIST_LOADING_IMAGES.length
		] ?? BUILD_LIST_LOADING_FALLBACK_IMAGE
	);
};

const BuildListLoading = () => {
	const [imageSrc, setImageSrc] = useState(
		BUILD_LIST_LOADING_IMAGES[0] ?? BUILD_LIST_LOADING_FALLBACK_IMAGE,
	);

	useEffect(() => {
		setImageSrc(getRandomLoadingImage());

		const intervalId = window.setInterval(() => {
			setImageSrc((currentImage) => getNextLoadingImage(currentImage));
		}, 500);

		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<Column className="min-h-80 w-full items-center justify-center gap-5">
			<Image
				key={imageSrc}
				src={imageSrc}
				alt="loading"
				width={120}
				height={120}
				className="h-28 w-28 object-contain"
				priority
				unoptimized
				onError={() => setImageSrc(BUILD_LIST_LOADING_FALLBACK_IMAGE)}
			/>
			<Typography variant="body2" className="text-secondary-foreground">
				목록을 불러오고 있어요...
			</Typography>
		</Column>
	);
};

export const BuildsClientPage = () => {
	const resetRef = useRef(false);
	const router = useRouter();
	const pathname = usePathname();
	const [openDialog, setOpenDialog] = useState(false);
	const [loginActionText, setLoginActionText] = useState("빌드를 공유하시려면");
	const [openSearch, setOpenSearch] = useState(false);

	const {
		page,
		setPage,
		isLatestVersion,
		setIsLatestVersion,
		likedOnly,
		setLikedOnly,
		recentDays,
		setRecentDays,
		isAscending,
		setIsAscending,
		searchList,
		setSearchList,
	} = useBuildSearchStore();
	const { data: info } = useSession();

	const { data, isLoading, isFetching } = useGetBuilds({
		page,
		limit: PAGE_SIZE,
		isLatestVersion,
		likedOnly,
		recentDays: isAscending ? recentDays : undefined,
		viewerId: info?.user.id,
		like: isAscending ? "asc" : "desc",
		isWriter: searchList.isWriter,
		...searchList,
	});
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();
	const { data: artifacts } = useGetArtifacts();

	const totalPage = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;
	const isBuildListLoading = isLoading || (isFetching && !data);

	const handleReset = () => {
		resetRef.current = true;

		setSearchList({});
		setPage(1);
		setLikedOnly(false);
		setRecentDays(undefined);

		const params = new URLSearchParams();
		params.set("page", "1");
		params.set("like", isAscending ? "asc" : "desc");
		params.set("latest", String(isLatestVersion));
		params.set("liked", "false");

		router.replace(`${pathname}?${params.toString()}`);

		setTimeout(() => {
			resetRef.current = false;
		});
	};

	const handleLike = (asc?: boolean) => {
		const nextIsAscending = !!asc;
		setIsAscending(nextIsAscending);
		if (!nextIsAscending) {
			setRecentDays(undefined);
		}
	};

	const handleRecentDaysChange = (value: string) => {
		if (value === "7" || value === "30") {
			setRecentDays(Number(value) as 7 | 30);
			setPage(1);
			return;
		}

		setRecentDays(undefined);
		setPage(1);
	};

	useSyncBuildQueryState({
		resetRef,
		page,
		setPage,
		isAscending,
		setIsAscending,
		isLatestVersion,
		setIsLatestVersion,
		likedOnly,
		setLikedOnly,
		recentDays,
		setRecentDays,
		searchList,
		setSearchList,
	});

	return (
		<Column className="w-full items-center px-3 pt-3 pb-8 md:px-6 md:pt-6 md:pb-16 gap-8">
			<SectionHeader
				imageName="build"
				title={"빌드 공유"}
				description={"빌드를 공유하거나 다양한 빌드를 확인해 보세요!"}
				className="w-full max-w-7xl"
			/>
			<Row className="w-full max-w-7xl mx-auto justify-center gap-6">
				<Column className="w-full justify-center gap-4">
					<Column className="gap-4">
						<Row className="w-full flex-wrap items-center justify-between gap-2">
							<Button asChild variant="outline" className="w-max">
								<Link href={SITEMAP.STATS}>
									<BarChart3 />
									빌드 통계
								</Link>
							</Button>
							<Row className="ml-auto justify-end items-center gap-2">
								<Button
									variant="outline"
									onClick={() => {
										setOpenSearch(true);
									}}
								>
									<Search />
									빌드 상세검색
								</Button>
								<Button
									variant="secondary"
									className="border"
									onClick={() => {
										if (info) {
											router.push(SITEMAP.ADD_BUILD);
											return;
										}

										setLoginActionText("빌드를 공유하시려면");
										setOpenDialog(true);
									}}
								>
									<FilePlus2 />
									빌드 작성하기
								</Button>
							</Row>
							<RequireLoginDialog
								open={openDialog}
								onOpenChange={setOpenDialog}
								actionText={loginActionText}
							/>
						</Row>
						{(Object.keys(searchList).length !== 0 ||
							likedOnly ||
							recentDays) && (
							<Row className="w-full justify-end">
								<Button
									className="w-max"
									variant="warning"
									size="sm"
									type="reset"
									onClick={handleReset}
								>
									<RotateCw />
									<Typography variant="caption">검색 초기화</Typography>
								</Button>
							</Row>
						)}
					</Column>
					<Separator />
					<AdSenseHorizontal className="py-0" />
					<Row className="w-full flex-col items-start gap-2 sm:flex-row sm:justify-between sm:items-center">
						<Row className="flex-wrap items-center gap-x-4 gap-y-2">
							<Row className="shrink-0 items-center gap-1">
								<Label className="w-max h-10 p-2 pr-0 hover:bg-accent/50 flex items-center gap-2 rounded-lg">
									<Checkbox
										checked={isLatestVersion}
										onCheckedChange={(checked: boolean) =>
											setIsLatestVersion(checked)
										}
										className="size-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
									/>
									<Typography variant="body2">최신버전 보기</Typography>
								</Label>
								<Tooltip>
									<TooltipTrigger asChild>
										<CircleHelpIcon className="w-5 h-5" />
									</TooltipTrigger>
									<TooltipContent sideOffset={16}>
										<Row className="gap-1 bg-accent border-2 dark:text-white text-black p-2 justify-center items-center text-center">
											<Typography variant="caption" className="text-blue-500">
												{process.env.NEXT_PUBLIC_GAME_VERSION?.split(".")
													.slice(0, 2)
													.join(".")}
												.*
											</Typography>
											<Typography variant="caption">버전만 검색</Typography>
										</Row>
									</TooltipContent>
								</Tooltip>
							</Row>
							<Label className="w-max h-10 p-2 hover:bg-accent/50 flex items-center gap-2 rounded-lg">
								<Checkbox
									checked={likedOnly}
									onCheckedChange={(checked: boolean) => {
										if (checked && !info) {
											setLoginActionText("좋아요한 빌드를 보시려면");
											setOpenDialog(true);
											return;
										}

										setLikedOnly(checked);
									}}
									className="size-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
								/>
								<Typography variant="body2">좋아요한 빌드 보기</Typography>
							</Label>
						</Row>
						<Row className="h-full w-full flex-wrap justify-end items-center gap-y-1 sm:w-auto">
							{isAscending && (
								<Row className="items-center gap-1">
									<Select
										value={recentDays ? String(recentDays) : "all"}
										onValueChange={handleRecentDaysChange}
									>
										<SelectTrigger
											size="sm"
											className="h-8 min-w-0 justify-end border-0 bg-transparent px-2 shadow-none"
										>
											<SelectValue placeholder="기간" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">전체</SelectItem>
											<SelectItem value="7">7일이내</SelectItem>
											<SelectItem value="30">30일이내</SelectItem>
										</SelectContent>
									</Select>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												size="icon"
												variant="ghost"
												className="size-4 text-muted-foreground"
												aria-label="작성일 기준 안내"
											>
												<CircleHelpIcon className="size-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent sideOffset={10}>
											<Row className="bg-accent border-2 dark:text-white text-black p-2 justify-center items-center text-center">
												<Typography variant="caption">
													수정일이 아닌 작성일 기준으로 표시됩니다.
												</Typography>
											</Row>
										</TooltipContent>
									</Tooltip>
								</Row>
							)}
							<Button
								size="sm"
								variant="ghost"
								onClick={() => handleLike(true)}
							>
								<Typography
									className={isAscending ? "text-blue-500" : ""}
									variant={isAscending ? "body2" : "caption"}
								>
									인기 순
								</Typography>
							</Button>
							<Separator
								className="max-h-1/3 bg-gray-700"
								orientation="vertical"
							/>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => handleLike(false)}
							>
								<Typography
									className={!isAscending ? "text-blue-500" : ""}
									variant={!isAscending ? "body2" : "caption"}
								>
									최신 순
								</Typography>
							</Button>
						</Row>
					</Row>
					{isBuildListLoading ? (
						<BuildListLoading />
					) : data?.data.length === 0 ? (
						<Column className="gap-4 justify-center items-center w-full h-full mt-12">
							<Column className="gap-8 items-center">
								<Image
									src="/white-wolf.png"
									alt="notFound"
									width={170}
									height={170}
								/>
								<Typography
									variant="header3"
									className="text-secondary-foreground"
								>
									데이터가 없습니다.
								</Typography>
							</Column>
							<Button onClick={handleReset} className="flex items-center gap-2">
								<RotateCw />
								<Typography>검색 초기화</Typography>
							</Button>
						</Column>
					) : (
						<Box className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(460px,1fr))] gap-6 w-full p-0">
							{data?.data.map((list) => (
								<BuildsCard
									data={list}
									weapon={weapons?.find(
										(weapon) => weapon.value === list.weapon,
									)}
									miracle={miracles?.find(
										(miracle) => miracle.value === list.miracle,
									)}
									artifact={
										artifacts?.filter((artifact) =>
											list.content[0].items.some(
												(item) => item.value === artifact.value,
											),
										) || []
									}
									key={list.postUuid}
								/>
							))}
						</Box>
					)}
				</Column>
			</Row>

			{data?.data.length !== 0 && (
				<>
					<BuildPagination
						page={page}
						setPage={(v) => setPage(v as number)}
						totalPage={totalPage}
					/>
					<AdSenseHorizontal className="py-0" />
				</>
			)}

			<BuildSearchButton
				open={openSearch}
				setOpen={setOpenSearch}
				setPage={(v) => setPage(v as number)}
			/>
		</Column>
	);
};
