import dayjs from "dayjs";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useCreateBuildLike } from "@/src/entities/build-detail";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Avatar,
	AvatarImage,
	Button,
	Column,
	copyToClipboard,
	RequireLoginDialog,
	Row,
	Separator,
	Typography,
} from "@/src/shared";

export const TitleDetail = ({
	initialLike,
	userId,
	setInitialLike,
	...data
}: BuildRow & {
	initialLike: number;
	userId?: string;
	setInitialLike: Dispatch<SetStateAction<number | undefined>>;
}) => {
	const { title, writer, created_at, updated_at, version, postUuid, combo } =
		data;
	const { mutate } = useCreateBuildLike();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<Column className="w-full gap-2">
			<Column className="w-full gap-1">
				{combo.length > 0 && (
					<Row className="flex-wrap gap-2">
						{combo.map((key) => (
							<Row
								key={key}
								className="items-center gap-1 border rounded-md px-2 py-1"
							>
								<Image
									width={16}
									height={16}
									unoptimized
									src={`/combo/${key}.png`}
									alt={key}
								/>
								<Typography variant="caption">
									{EFFECT_LABELS[key] || key}
								</Typography>
							</Row>
						))}
					</Row>
				)}
				<Row className="w-full justify-between">
					<Typography variant="body" className="truncate md:text-2xl text-base">
						{title}
					</Typography>
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-0"
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
						<Row className="items-center gap-2">
							<ThumbsUp className="w-5 h-5" />
							<Typography variant="body2">{initialLike || 0}</Typography>
						</Row>
					</Button>
					<RequireLoginDialog
						open={openDialog}
						onOpenChange={setOpenDialog}
						actionText="좋아요를 누르시려면"
					/>
				</Row>
			</Column>
			<Row className="h-8 justify-between items-center gap-2">
				<Row className="min-w-0 items-center gap-2">
					<Avatar>
						<AvatarImage src={writer.profileImage} />
					</Avatar>
					<Typography variant="body2" className="truncate">
						{writer.nickname}
					</Typography>
				</Row>
				<Row className="h-full items-center gap-2">
					{version && (
						<Typography variant="body2" className="text-gray-500">
							v{version}
						</Typography>
					)}
					<Separator className="max-h-1/3 bg-gray-700" orientation="vertical" />
					<Typography
						variant="body2"
						className="text-gray-500 whitespace-nowrap"
					>
						작성일: {dayjs(created_at).format("YY.MM.DD")}{" "}
						{updated_at && "(수정됨)"}
					</Typography>
				</Row>
			</Row>
			<Row className="w-full justify-end">
				<Button
					onClick={() => {
						const url = window.location.href;
						copyToClipboard(url);
					}}
					size="sm"
				>
					주소복사
				</Button>
			</Row>
		</Column>
	);
};
