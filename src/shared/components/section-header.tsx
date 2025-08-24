import { Box } from "../ui/box";
import { Typography } from "../ui/typography";

interface SectionHeaderProps {
	title: string;
	description: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => {
	return (
		<Box className="flex-col gap-2 p-4">
			<Typography variant="header1">{title}</Typography>
			{description && (
				<Typography variant="body2" className="text-gray-500">
					{description}
				</Typography>
			)}
		</Box>
	);
};
