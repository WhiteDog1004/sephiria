import { ThumbsUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useCreateBuildLike } from "@/src/entities/build-detail";
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
	const { mutate } = useCreateBuildLike();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<Row className="w-full justify-center">
			<Button
				variant="default"
				onClick={() => {
					if (!userId) {
						setOpenDialog(true);
						return;
					}

					mutate(
						{ postUuid, userId },
						{
							onSuccess: () => {
								setInitialLike((initialLike || 0) + 1);
							},
						},
					);
				}}
			>
				<Row className="items-center gap-1">
					<ThumbsUp />
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
