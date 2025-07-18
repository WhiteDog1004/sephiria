import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import type { ArtifactInstance, SlabsOptions, SlotId } from "../../types";
import { SlotComponent } from "./SlotComponent";

export const InventorySlot = ({
	id,
	item,
	effectValue,
	effectFlag,
	onRotate,
	isOver,
}: {
	id: SlotId;
	item?: SlabsOptions & ArtifactInstance["data"];
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
			className={`relative w-20 h-20 rounded-sm p-1 border-4 border-[#222034] transition-colors bg-[#623144] ${clsx(
				item && (item.type === "slabs" ? "bg-[#3a3a57]" : "bg-[#3a3a47]"),
				isOver && "bg-gray-600",
			)}`}
		>
			<Box className="absolute w-11/12 h-11/12 border-2 border-gray-950/20 rounded-sm" />
			{item && (
				<SlotComponent
					item={item}
					isDragging={false}
					onRotate={(e) => onRotate(item.id, e)}
				/>
			)}
			{effectValue > 0 ? (
				<Box className={`${boxStyles} text-green-400 z-50 pointer-events-none`}>
					<Typography>{effectValue}</Typography>
				</Box>
			) : (
				effectValue < 0 && (
					<Box className={`${boxStyles} text-red-600 z-50`}>{effectValue}</Box>
				)
			)}
			{effectFlag === "ignore" && (
				<Box className={`${boxStyles} bg-blue-300/30`}></Box>
			)}
		</Box>
	);
};
