import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";

export const ArtifactTitle = () => {
	return (
		<Box className="flex-col gap-2 p-4">
			<Typography variant="header1">아티팩트</Typography>
			<Typography variant="body2" className="text-gray-500">
				원하는 아티팩트에 마우스를 올리면 효과를 볼 수 있어요!
			</Typography>
		</Box>
	);
};
