import Image from "next/image";
import Link from "next/link";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	getWriterBuildSearchHref,
	Row,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import type { WriterBuildStatsRow } from "../model/builds.types";

type BadgeLevel = WriterBuildStatsRow["badge_level"];
type NicknameColor = WriterBuildStatsRow["nickname_color"];

const getBadgeSrc = (badgeLevel: BadgeLevel) =>
	`/level/level_${badgeLevel}.png`;

const getBadgeTooltipText = (badgeLevel: BadgeLevel, buildCount?: number) => {
	const countText = buildCount === undefined ? "" : ` · 작성글 ${buildCount}개`;

	return `레벨 ${badgeLevel}${countText}`;
};

type AvatarBoxProps = {
	img: string;
	nickname: string;
	uuid: string;
	badgeLevel?: BadgeLevel;
	nicknameColor?: NicknameColor;
	buildCount?: number;
	onViewWriterPosts?: (uuid: string) => void;
};

export const AvatarBox = ({
	img,
	nickname,
	uuid,
	badgeLevel = 0,
	buildCount,
	onViewWriterPosts,
}: AvatarBoxProps) => {
	return (
		<Row className="w-full min-w-0 items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-auto min-w-0 max-w-full shrink justify-start overflow-hidden p-0"
					>
						<Avatar>
							<AvatarImage src={img} />
							<AvatarFallback>?</AvatarFallback>
						</Avatar>
						<Row className="min-w-0 items-center gap-1">
							<Tooltip delayDuration={200}>
								<TooltipTrigger asChild>
									<Image
										width={18}
										height={18}
										src={getBadgeSrc(badgeLevel)}
										alt={`작성자 뱃지 ${badgeLevel}단계`}
										className="shrink-0"
										unoptimized
									/>
								</TooltipTrigger>
								<TooltipContent
									sideOffset={8}
									className="rounded-sm bg-gray-800 px-3 py-2 text-white"
								>
									<Typography variant="caption">
										{getBadgeTooltipText(badgeLevel, buildCount)}
									</Typography>
								</TooltipContent>
							</Tooltip>
							<Typography
								variant="body2"
								className="min-w-0 max-w-full truncate"
							>
								{nickname}
							</Typography>
						</Row>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{onViewWriterPosts ? (
						<DropdownMenuItem onSelect={() => onViewWriterPosts(uuid)}>
							작성글 보기
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem asChild>
							<Link href={getWriterBuildSearchHref(uuid)}>작성글 보기</Link>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</Row>
	);
};
