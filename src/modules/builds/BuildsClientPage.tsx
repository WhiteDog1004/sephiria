"use client";

import { RotateCw } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useGetArtifacts } from "@/src/entities/builds/model/useGetArtifacts";
import { useGetBuilds } from "@/src/entities/builds/model/useGetBuilds";
import { useGetMiracles } from "@/src/entities/builds/model/useGetMiracles";
import { useGetWeapons } from "@/src/entities/builds/model/useGetWeapons";
import { useBuildSearchStore } from "@/src/features/builds/model/buildSearchStore";
import { BuildSearchButton } from "@/src/features/builds/ui/BuildSearchButton";
import { Box, Button, Column, Row, Typography } from "@/src/shared";
import { BuildsCard } from "./BuildsCard";

export const BuildsClientPage = () => {
	const { searchList, setSearchList } = useBuildSearchStore();
	const { data, refetch } = useGetBuilds({ ...searchList });
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();
	const { data: artifacts } = useGetArtifacts();

	useEffect(() => {
		if (searchList) {
			refetch();
		}
	}, [searchList, refetch]);

	return (
		<Box className="p-6">
			<Row className="w-full max-w-7xl mx-auto justify-center gap-6">
				<Column className="w-full justify-center">
					<Row></Row>
					{data?.length === 0 ? (
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
							{data?.map((list) => (
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
											list.content.some((content) =>
												content.items.some(
													(item) => item.value === artifact.value,
												),
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

			<BuildSearchButton />
		</Box>
	);
};
