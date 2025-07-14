import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import Image from "next/image";
import { getSlabsTierColor } from "@/src/shared/lib/getSlabsTierColor";
import { Box } from "@/src/shared/ui/box";
import { Column } from "@/src/shared/ui/column";
import { Typography } from "@/src/shared/ui/typography";
import { ITEM_SLABS_DATA } from "../config/slabsLists";

interface ItemSourceProps {
	item: {
		type: "slabs" | "artifact";
		id: string;
		label: string;
		rotation?: number;
		image: string;
	};
}

export const ItemSource = ({ item }: ItemSourceProps) => {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `source-${item.id}-${item.type}`,
		data: { type: "source-item", item },
	});

	return (
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
				className={`whitespace-nowrap text-center ${clsx(item.type === "slabs" && getSlabsTierColor(ITEM_SLABS_DATA.find((i) => i.value === item.id)?.tier || ""), item.type === "artifact" && "")}`}
				variant="caption"
			>
				{item.label}
			</Typography>
		</Column>
	);
};
