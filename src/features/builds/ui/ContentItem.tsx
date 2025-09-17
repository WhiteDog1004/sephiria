import clsx from "clsx";
import type { ReactNode } from "react";
import {
	Box,
	Column,
	ImageWithFallback,
	Separator,
	Typography,
} from "@/src/shared";

type ContentItemProps = {
	title: string;
	img?: string;
	name?: string;
	className?: string;
	content?: ReactNode;
};

export const ContentItem = ({
	title,
	img,
	name,
	className,
	content,
}: ContentItemProps) => {
	return (
		<Column
			className={`w-full items-center border rounded-md ${clsx(className)}`}
		>
			<Typography className="p-2" variant="caption">
				{title}
			</Typography>
			<Separator />
			{img && (
				<Box className="h-max p-0">
					<ImageWithFallback
						className="p-1 w-12 h-12 object-contain"
						width={32}
						height={32}
						src={img}
						alt={"dry_wind"}
						unoptimized
					/>
				</Box>
			)}
			{content && content}
			{name && (
				<Typography className="w-full p-2 truncate" variant="caption">
					{name}
				</Typography>
			)}
		</Column>
	);
};
