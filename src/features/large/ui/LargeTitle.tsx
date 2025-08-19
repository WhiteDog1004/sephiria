import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";

export const LargeTitle = () => {
	return (
		<Box className="flex-col gap-2">
			<Typography variant="header1">석판</Typography>
			<Typography variant="body2" className="text-gray-500">
				원하는 석판에 마우스를 올리면 효과를 볼 수 있어요!
			</Typography>
		</Box>
	);
};
