import clsx from "clsx";
import type { ReactNode } from "react";
import {
	Box,
	Column,
	ImageWithFallback,
	Separator,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

type ContentItemProps = {
	title: string;
	img?: string;
	imageOverlay?: ReactNode;
	isRemoved?: boolean;
	name?: string;
	className?: string;
	content?: ReactNode;
};

export const ContentItem = ({
	title,
	img,
	imageOverlay,
	isRemoved = false,
	name,
	className,
	content,
}: ContentItemProps) => {
	return (
		<Column
			className={`w-full flex-1 overflow-hidden items-center border rounded-md ${clsx(className)}`}
		>
			<Typography className="p-2 truncate w-full" variant="caption">
				{title}
			</Typography>
			<Separator />
			<Column className="justify-center items-center w-full h-full p-2 gap-1">
				{img && (
					<Box className="relative h-max p-0">
						<ImageWithFallback
							className={clsx(
								"p-1 w-12 h-12 object-contain",
								isRemoved && "opacity-40",
							)}
							width={32}
							height={32}
							src={getCloudflareUrl(img)}
							alt={"dry_wind"}
							unoptimized
						/>
						{imageOverlay}
					</Box>
				)}
				{content && content}
				{name && (
					<Typography
						className={clsx("w-full truncate", isRemoved && "line-through")}
						variant="caption"
					>
						{name}
					</Typography>
				)}
			</Column>
		</Column>
	);
};
