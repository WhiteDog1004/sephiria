"use client";

import { FilePlus2, RotateCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetArtifacts } from "@/src/entities/builds/model/useGetArtifacts";
import { useGetBuilds } from "@/src/entities/builds/model/useGetBuilds";
import { useGetMiracles } from "@/src/entities/builds/model/useGetMiracles";
import { useGetWeapons } from "@/src/entities/builds/model/useGetWeapons";
import { useBuildSearchStore } from "@/src/features/builds/model/buildSearchStore";
import { BuildPagination } from "@/src/features/builds/ui/BuildPagination";
import { BuildSearchButton } from "@/src/features/builds/ui/BuildSearchButton";
import {
	Box,
	Button,
	Column,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Row,
	Separator,
	SITEMAP,
	Typography,
} from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { discordLoginHandler } from "../../header/model/discordLoginHelper";
import { useSession } from "../../header/model/useUserInfo";
import { BuildsCard } from "./BuildsCard";

const PAGE_SIZE = 10;

export const BuildsClientPage = () => {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { searchList, setSearchList } = useBuildSearchStore();
	const { data, refetch } = useGetBuilds({
		page,
		limit: PAGE_SIZE,
		...searchList,
	});
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();
	const { data: artifacts } = useGetArtifacts();
	const { data: info } = useSession();
	const [openDialog, setOpenDialog] = useState(false);
	const totalPage = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0;

	useEffect(() => {
		if (searchList || page) {
			refetch();
		}
	}, [searchList, refetch, page]);

	return (
		<Column className="w-full p-6 gap-8">
			<SectionHeader
				title={"빌드 공유"}
				description={"빌드를 공유하거나 다양한 빌드를 확인해 보세요!"}
			/>
			<Row className="w-full max-w-7xl mx-auto justify-center gap-6">
				<Column className="w-full justify-center gap-4">
					<Row className="w-full justify-end items-center gap-2">
						{Object.keys(searchList).length !== 0 && (
							<Button
								variant="secondary"
								type="reset"
								className="border"
								onClick={() => {
									setSearchList({});
									setPage(1);
								}}
							>
								<RotateCw />
								<Typography variant="caption">검색 초기화</Typography>
							</Button>
						)}
						<Dialog open={openDialog} onOpenChange={setOpenDialog}>
							<Button
								variant="secondary"
								className="border"
								onClick={() => {
									if (info) {
										router.push(SITEMAP.ADD_BUILD);
										return;
									}
									if (!info) {
										setOpenDialog(true);
									}
								}}
							>
								<FilePlus2 />
								빌드 작성하기
							</Button>
							<DialogContent>
								<DialogHeader>
									<DialogTitle className="hidden">
										로그인이 필요해요
									</DialogTitle>
									<DialogDescription asChild>
										<Column className="justify-center items-center gap-4">
											<Image
												src="/white-wolf.png"
												alt="needLogin"
												width={80}
												height={80}
											/>
											<Typography className="text-center" variant="body2">
												앗 잠깐만요!
												<br />
												빌드를 공유하시려면
												<br />
												<b className="text-blue-600">디스코드 로그인</b>이
												필요해요!
											</Typography>
											<Button onClick={discordLoginHandler}>
												<Image
													src={"/discord-icon.svg"}
													width={20}
													height={20}
													alt={"discord"}
													className="invert dark:invert-0"
												/>
												디스코드 로그인
											</Button>
										</Column>
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</Row>
					{/* <Row></Row> */}
					<Separator />
					{data?.data.length === 0 ? (
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
							<Button
								onClick={() => setSearchList({})}
								className="flex items-center gap-2"
							>
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
				<BuildPagination page={page} setPage={setPage} totalPage={totalPage} />
			)}

			<BuildSearchButton setPage={setPage} />
		</Column>
	);
};
