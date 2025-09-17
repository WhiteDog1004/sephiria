import { Typography } from "@/src/shared";

export const Title = ({ title }: { title: string }) => {
	return <Typography className="truncate">{title}</Typography>;
};
