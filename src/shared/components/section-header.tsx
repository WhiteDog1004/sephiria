import Image from "next/image";
import { cn } from "@/lib/utils";
import { Box } from "../ui/box";
import { Typography } from "../ui/typography";

interface SectionHeaderProps {
	title: string;
	description: string;
	imageName?: string;
	className?: string;
}

export const SectionHeader = ({
	title,
	description,
	imageName,
	className,
}: SectionHeaderProps) => {
	return (
		<Box className={cn("relative flex-col gap-2 p-4", className)}>
			{imageName && (
				<Image
					width={360}
					height={180}
					src={`/${imageName}.png`}
					alt={"builds"}
					className="absolute top-0 left-0 w-full h-full object-cover opacity-20 rounded-lg z-0"
					unoptimized
				/>
			)}
			<Typography variant="header1" className="z-10">
				{title}
			</Typography>
			{description && (
				<Typography
					variant="body2"
					className="text-gray-500 whitespace-pre-line text-center z-10"
				>
					{description}
				</Typography>
			)}
		</Box>
	);
};
