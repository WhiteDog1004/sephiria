import dayjs from "dayjs";
import clsx from "clsx";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import {
	buildLikeQueryKey,
	useBuildLikeStatus,
	useCreateBuildLike,
	useDeleteBuildLike,
} from "@/src/entities/build-detail";
import type { BuildWithLikeStatus } from "@/src/entities/builds/model/builds.types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Avatar,
	AvatarImage,
	Button,
	Column,
	copyToClipboard,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	getWriterBuildSearchHref,
	RequireLoginDialog,
	Row,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";

export const TitleDetail = ({
	initialLike,
	userId,
	setInitialLike,
	...data
}: BuildWithLikeStatus & {
	initialLike: number;
	userId?: string;
	setInitialLike: Dispatch<SetStateAction<number | undefined>>;
}) => {
	const {
		title,
		writer,
		created_at,
		updated_at,
		version,
		postUuid,
		combo,
		isLiked: initialLiked,
	} = data;
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
	const createdDate = dayjs(created_at).format("YY.MM.DD");
	const createdTooltipDate = dayjs(created_at).format("YY.MM.DD HH:mm");
	const updatedTooltipDate = updated_at
		? dayjs(updated_at).format("YY.MM.DD HH:mm")
		: "-";

	const updateLikeStatus = (liked: boolean) => {
		queryClient.setQueryData(buildLikeQueryKey(likeReq), { liked });
	};

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
				<Row className="w-full min-w-0 justify-between gap-2">
					<Typography
						variant="body"
						className="min-w-0 truncate md:text-2xl text-base"
					>
						{title}
					</Typography>
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-0"
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
							<span
								className={clsx(
									"inline-flex size-5 items-center justify-center rounded-md",
									isLiked &&
										"size-6 bg-yellow-200 text-amber-700 dark:bg-yellow-400/20 dark:text-yellow-300",
								)}
							>
								<ThumbsUp
									className="size-4"
									strokeWidth={2}
								/>
							</span>
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
			<Row className="h-8 justify-between items-center gap-2 overflow-hidden">
				<Row className="min-w-0 items-center gap-2 overflow-hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-auto min-w-0 max-w-full shrink justify-start overflow-hidden p-0"
							>
								<Avatar>
									<AvatarImage src={writer.profileImage} />
								</Avatar>
								<Typography
									variant="body2"
									className="min-w-0 max-w-full truncate"
								>
									{writer.nickname}
								</Typography>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem asChild>
								<Link href={getWriterBuildSearchHref(writer.uuid)}>
									작성글 보기
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</Row>
				<Row className="h-full shrink-0 items-center gap-2">
					{version && (
						<Typography variant="body2" className="text-gray-500">
							v{version}
						</Typography>
					)}
					<Separator className="max-h-1/3 bg-gray-700" orientation="vertical" />
					<Tooltip delayDuration={300}>
						<TooltipTrigger asChild>
							<Typography
								asChild
								variant="body2"
								className="cursor-help text-gray-500 whitespace-nowrap"
							>
								<span>
									작성일: {createdDate} {updated_at && "(수정됨)"}
								</span>
							</Typography>
						</TooltipTrigger>
						<TooltipContent
							sideOffset={8}
							className="space-y-1 rounded-sm bg-gray-800 px-3 py-2 text-white"
						>
							<Typography variant="caption" className="leading-4">
								작성일 : {createdTooltipDate}
							</Typography>
							<Typography variant="caption" className="leading-4">
								수정일 : {updatedTooltipDate}
							</Typography>
						</TooltipContent>
					</Tooltip>
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
