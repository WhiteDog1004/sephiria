import { ThumbsUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useCreateBuildLike } from "@/src/entities/build-detail";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { Button, Row, Typography } from "@/src/shared";

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

	if (!userId) return;
	return (
		<Row className="w-full justify-center">
			<Button
				variant="default"
				onClick={() => {
					mutate(
						{ postUuid, userId: userId },
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
		</Row>
	);
};
