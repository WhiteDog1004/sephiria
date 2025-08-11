import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import type {
	ItemSourceProps,
	SlabsOptions,
} from "@/src/entities/simulator/types";
import { getItemsTierColor } from "@/src/shared/lib/getSlabsTierColor";
import { Box } from "@/src/shared/ui/box";
import { Column } from "@/src/shared/ui/column";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/shared/ui/tooltip";
import { Typography } from "@/src/shared/ui/typography";
import { ITEM_SLABS_DATA } from "../config/slabsLists";
import { SlabEffectTooltip } from "./SlabsTootltip";

export const ItemSource = ({ item }: ItemSourceProps) => {
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
					className="w-19 h-24 p-1 cursor-grab"
				>
					<Box className="relative h-full p-0">
						<Image unoptimized fill src={item.image || ""} alt={"items"} />
					</Box>
					<Typography
						className={`whitespace-nowrap text-center overflow-hidden text-ellipsis ${clsx(item.type === "slabs" ? getItemsTierColor(ITEM_SLABS_DATA.find((i) => i.value === item.id)?.tier || "") : getItemsTierColor(item.data?.tier || ""))}`}
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
			</TooltipContent>
		</Tooltip>
	);
};
