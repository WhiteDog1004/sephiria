import { Typography } from "@/src/shared";

export const Title = ({ title }: { title: string }) => {
	return (
		<Typography
			variant="body2"
			className="truncate text-center border rounded-md p-2 bg-gray-200 dark:bg-gray-800"
		>
			{title}
		</Typography>
	);
};
