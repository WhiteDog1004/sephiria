import dayjs from "dayjs";
import { ThumbsUp } from "lucide-react";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import {
	Avatar,
	AvatarImage,
	Column,
	Row,
	Separator,
	Typography,
} from "@/src/shared";

export const TitleDetail = ({ ...data }: BuildRow) => {
	const { title, writer, created_at, updated_at, postLike, version } = data;

	return (
		<Column className="w-full gap-2">
			<Row className="w-full justify-between">
				<Typography variant="header1" className="truncate">
					{title}
				</Typography>
				<Row className="items-center gap-2">
					<ThumbsUp className="w-5 h-5" />
					<Typography variant="body2">{postLike || 0}</Typography>
				</Row>
			</Row>
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
						작성일: {dayjs(updated_at ?? created_at).format("YY.MM.DD")}{" "}
						{updated_at && "(수정됨)"}
					</Typography>
				</Row>
			</Row>
		</Column>
	);
};
