import { Box, Typography } from "@/src/shared";

export const Description = ({ description }: { description: string }) => {
	return (
		<Box className="w-full border rounded-md p-2 overflow-hidden">
			<Typography variant="body2" className="line-clamp-2">
				{description}
			</Typography>
		</Box>
	);
};
