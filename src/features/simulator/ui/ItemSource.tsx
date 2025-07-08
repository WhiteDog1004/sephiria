import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import type { SlabsOptions } from "@/src/entities/simulator/types";
import { getSlabsTierColor } from "@/src/shared/lib/getSlabsTierColor";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import { ITEM_MASTER_DATA } from "../config/slabsLists";

export const ItemSource = ({ item }: { item: SlabsOptions }) => {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `source-${item.id}`,
		data: { type: "source-item", item },
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			className="flex flex-col w-19 h-24 p-1 cursor-grab"
		>
			<Box className="relative h-full p-0">
				<Image unoptimized fill src={item.image || ""} alt={"slabs"} />
			</Box>
			<Typography
				className={`text-center ${getSlabsTierColor(ITEM_MASTER_DATA.find((i) => i.value === item.id)?.tier || "")}`}
				variant="caption"
			>
				{item.label}
			</Typography>
		</div>
	);
};
