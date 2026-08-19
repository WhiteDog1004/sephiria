import { ThumbsUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
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
	initialLiked?: boolean;
	setInitialLike: Dispatch<SetStateAction<number | undefined>>;
};

export const BuildLike = (req: BuildLikeProps) => {
	const { userId, postUuid, initialLike, initialLiked, setInitialLike } = req;
	const queryClient = useQueryClient();
	const likeReq = { postUuid, userId: userId ?? "" };
	const { data: likeStatus, isLoading: isLikeStatusLoading } =
		useBuildLikeStatus(likeReq, Boolean(userId), initialLiked);
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
				variant={isLiked ? "outline" : "default"}
				className={clsx(
					isLiked &&
						"border-amber-300 bg-yellow-100 text-amber-800 hover:bg-yellow-200 dark:border-yellow-400/40 dark:bg-yellow-400/15 dark:text-yellow-300 dark:hover:bg-yellow-400/25",
				)}
				disabled={Boolean(userId) && isPending}
				onClick={() => {
					if (!userId) {
						setOpenDialog(true);
						return;
					}

					if (isLiked) {
						deleteLike(likeReq, {
							onSuccess: (response) => {
								updateLikeStatus(false);
								setInitialLike(response.postLike);
							},
						});
						return;
					}

					createLike(likeReq, {
						onSuccess: (response) => {
							updateLikeStatus(true);
							setInitialLike(response.postLike);
						},
					});
				}}
			>
				<Row className="items-center gap-1">
					<ThumbsUp className={clsx("size-4", isLiked && "fill-current")} />
					<Typography variant="body2">{initialLike || 0}</Typography>
				</Row>
				<Typography>{isLiked ? "좋아요함" : "좋아요"}</Typography>
			</Button>
			<RequireLoginDialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				actionText="좋아요를 누르시려면"
			/>
		</Row>
	);
};
