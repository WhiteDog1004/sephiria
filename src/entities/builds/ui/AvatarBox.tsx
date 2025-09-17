import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Row,
	Typography,
} from "@/src/shared";

type AvatarBoxProps = {
	img: string;
	nickname: string;
};

export const AvatarBox = ({ img, nickname }: AvatarBoxProps) => {
	return (
		<Row className="items-center gap-2">
			<Avatar>
				<AvatarImage src={img} />
				<AvatarFallback>?</AvatarFallback>
			</Avatar>
			<Typography variant="body2" className="max-w-32 truncate">
				{nickname}
			</Typography>
		</Row>
	);
};
