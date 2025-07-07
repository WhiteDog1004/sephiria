import { useDroppable } from "@dnd-kit/core";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import type { SlabsOptions, SlotId } from "../../types";
import { SlabsComponent } from "./Slabs";

export const InventorySlot = ({
	id,
	item,
	effectValue,
	effectFlag,
	onRotate,
	isOver,
}: {
	id: SlotId;
	item?: SlabsOptions;
	effectValue: number;
	effectFlag: "ignore" | null;
	onRotate: (id: string, e: React.MouseEvent) => void;
	isOver: boolean;
}) => {
	const { setNodeRef } = useDroppable({ id, data: { type: "slot" } });
	const boxStyles = `absolute top-0 left-0 w-full h-full p-1 flex items-start justify-start`;

	return (
		<Box
			ref={setNodeRef}
			className={`relative w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg p-1 transition-colors ${isOver && "bg-gray-600"}`}
		>
			{item && (
				<SlabsComponent
					item={item}
					isDragging={false}
					onRotate={(e) => onRotate(item.id, e)}
				/>
			)}
			{effectValue > 0 ? (
				<Box className={`${boxStyles} text-green-400`}>
					<Typography>{effectValue}</Typography>
				</Box>
			) : (
				effectValue < 0 && (
					<Box className={`${boxStyles} text-red-600`}>{effectValue}</Box>
				)
			)}
			{effectFlag === "ignore" && (
				<Box className={`${boxStyles} bg-blue-300/50`}></Box>
			)}
		</Box>
	);
};
