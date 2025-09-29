"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { useDeleteBuild } from "@/src/entities/builds/model/useDeleteBuild";
import {
	BuildArtifact,
	BuildDescription,
	SectionCostume,
	SectionMiracle,
	SectionWeapon,
	TalentDetail,
	TitleDetail,
} from "@/src/features/build-detail";
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
import { useSession } from "../../header/model/useUserInfo";

export const BuildDetailClientPage = ({ data }: { data: BuildRow }) => {
	const router = useRouter();
	const { mutate } = useDeleteBuild();
	const { data: user } = useSession();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<Box className="w-full py-12 px-4">
			<Column className="w-full max-w-5xl gap-4">
				<TitleDetail {...data} />
				<Separator />
				<Box className="md:flex-row flex-col items-start gap-4 md:gap-2 mt-4 p-0">
					<Row className="w-full gap-2">
						<SectionCostume costume={data.costume} />
						<SectionMiracle miracle={data.miracle} />
					</Row>
					<SectionWeapon weapon={data.weapon} />
				</Box>
				<Separator />
				<TalentDetail talent={data.ability} />
				<Separator />
				<BuildArtifact artifacts={data.content} />
				<Separator />
				<BuildDescription description={data.description} />
				<Separator />
				<Row className="justify-between gap-2 mb-12">
					<Button onClick={() => router.push(SITEMAP.BUILDS)}>목록으로</Button>
					{user?.user.id === data.writer.uuid && (
						<Row className="gap-2">
							<Button>수정하기</Button>
							<Dialog open={openDialog} onOpenChange={setOpenDialog}>
								<Button
									onClick={() => setOpenDialog(true)}
									variant="destructive"
								>
									삭제하기
								</Button>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="hidden"></DialogTitle>
									</DialogHeader>
									<DialogDescription asChild>
										<Column className="justify-center items-center gap-4">
											<Image
												src="/white-wolf.png"
												alt="delete"
												width={80}
												height={80}
											/>
											<Typography>해당 공유글을 삭제하시겠어요?</Typography>
											<Typography>삭제하면 복구가 어렵습니다.</Typography>
											<Row className="gap-4">
												<Button onClick={() => setOpenDialog(false)}>
													취소
												</Button>
												<Button
													onClick={() =>
														mutate(data.postUuid, {
															onSuccess: () => router.replace(SITEMAP.BUILDS),
														})
													}
													variant="destructive"
												>
													삭제
												</Button>
											</Row>
										</Column>
									</DialogDescription>
								</DialogContent>
							</Dialog>
						</Row>
					)}
				</Row>
			</Column>
		</Box>
	);
};
