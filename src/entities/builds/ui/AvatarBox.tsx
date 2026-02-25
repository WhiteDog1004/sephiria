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
	Typography,
} from "@/src/shared";

type AvatarBoxProps = {
	img: string;
	nickname: string;
	onViewWriterPosts?: (nickname: string) => void;
};

export const AvatarBox = ({
	img,
	nickname,
	onViewWriterPosts,
}: AvatarBoxProps) => {
	return (
		<Row className="w-full min-w-0 items-center gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-auto p-0">
						<Avatar>
							<AvatarImage src={img} />
							<AvatarFallback>?</AvatarFallback>
						</Avatar>
						<Typography variant="body2" className="truncate">
							{nickname}
						</Typography>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{onViewWriterPosts ? (
						<DropdownMenuItem onSelect={() => onViewWriterPosts(nickname)}>
							작성글 보기
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem asChild>
							<Link href={getWriterBuildSearchHref(nickname)}>작성글 보기</Link>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</Row>
	);
};
