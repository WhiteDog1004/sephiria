import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import type {
	ArtifactInstance,
	ItemSourceProps,
	SlabsOptions,
} from "@/src/entities/simulator/types";
import { getItemsTierColor } from "@/src/features/simulator/lib/getItemsTierColor";
import { Box } from "@/src/shared/ui/box";
import { Column } from "@/src/shared/ui/column";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/shared/ui/tooltip";
import { Typography } from "@/src/shared/ui/typography";
import { ITEM_SLABS_DATA } from "../config/slabsLists";
import { ArtifactTooltip } from "./ArtifactTooltip";
import { SlabEffectTooltip } from "./SlabsTooltip";

export const ItemSource = ({ item, isPreview }: ItemSourceProps) => {
	const { theme } = useTheme();
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `source-${item.id}-${item.type}`,
		data: { type: "source-item", item },
	});

	return (
		<Tooltip open={tooltipOpen}>
			<TooltipTrigger
				onMouseEnter={() => setTooltipOpen(true)}
				onMouseLeave={() => setTooltipOpen(false)}
				asChild
			>
				<Column
					ref={setNodeRef}
					{...listeners}
					{...attributes}
					className={`w-19 h-24 p-1 touch-none ${isPreview ? "cursor-auto" : "cursor-grab"}`}
				>
					<Box className="relative h-full p-0">
						<Image unoptimized fill src={item.image || ""} alt={"items"} />
					</Box>
					<Typography
						className={`py-1 whitespace-nowrap text-center overflow-hidden text-ellipsis ${clsx(item.type === "slabs" ? getItemsTierColor(ITEM_SLABS_DATA.find((i) => i.value === item.id)?.tier || "", theme === "light") : getItemsTierColor(item.data?.tier || "", theme === "light"))}`}
						variant="caption"
					>
						{item.label}
					</Typography>
				</Column>
			</TooltipTrigger>

			<TooltipContent>
				{item.type === "slabs" && (
					<SlabEffectTooltip slab={item as SlabsOptions} />
				)}
				{item.type === "artifact" && (
					<ArtifactTooltip data={item.data as ArtifactInstance["item"]} />
				)}
			</TooltipContent>
		</Tooltip>
	);
};
