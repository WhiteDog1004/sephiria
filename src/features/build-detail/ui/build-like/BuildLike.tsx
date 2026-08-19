import { ThumbsUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
	buildLikeQueryKey,
	useBuildLikeStatus,
	useCreateBuildLike,
	useDeleteBuildLike,
} from "@/src/entities/build-detail";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { Button, RequireLoginDialog, Row, Typography } from "@/src/shared";

type BuildLikeProps = {
	postUuid: BuildRow["postUuid"];
	userId?: string;
	postLike: BuildRow["postLike"];
	initialLike?: number;
	setInitialLike: Dispatch<SetStateAction<number | undefined>>;
};

export const BuildLike = (req: BuildLikeProps) => {
	const { userId, postUuid, initialLike, setInitialLike } = req;
	const queryClient = useQueryClient();
	const likeReq = { postUuid, userId: userId ?? "" };
	const { data: likeStatus, isLoading: isLikeStatusLoading } =
		useBuildLikeStatus(likeReq, Boolean(userId));
	const { mutate: createLike, isPending: isCreatePending } =
		useCreateBuildLike();
	const { mutate: deleteLike, isPending: isDeletePending } =
		useDeleteBuildLike();
	const [openDialog, setOpenDialog] = useState(false);
	const isLiked = Boolean(likeStatus?.liked);
	const isPending = isLikeStatusLoading || isCreatePending || isDeletePending;

	const updateLikeStatus = (liked: boolean) => {
		queryClient.setQueryData(buildLikeQueryKey(likeReq), { liked });
	};

	return (
		<Row>
			<Button
				variant="default"
				disabled={Boolean(userId) && isPending}
				onClick={() => {
					if (!userId) {
						setOpenDialog(true);
						return;
					}

					if (isLiked) {
						deleteLike(likeReq, {
							onSuccess: () => {
								updateLikeStatus(false);
								setInitialLike((current) => Math.max((current ?? 0) - 1, 0));
							},
						});
						return;
					}

					createLike(likeReq, {
						onSuccess: () => {
							updateLikeStatus(true);
							setInitialLike((current) => (current ?? 0) + 1);
						},
					});
				}}
			>
				<Row className="items-center gap-1">
					<ThumbsUp className={isLiked ? "fill-current" : undefined} />
					<Typography variant="body2">{initialLike || 0}</Typography>
				</Row>
				<Typography>좋아요</Typography>
			</Button>
			<RequireLoginDialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				actionText="좋아요를 누르시려면"
			/>
		</Row>
	);
};
