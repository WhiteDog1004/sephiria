import { useDroppable } from "@dnd-kit/core";
import type { SlabsOptions, SlotId } from "../../types";
import { SlabsComponent } from "./Slabs";

export const InventorySlot = ({
	id,
	item,
	effectValue,
	onRotate,
	isOver,
}: {
	id: SlotId;
	item?: SlabsOptions;
	effectValue: number;
	onRotate: (id: string, e: React.MouseEvent) => void;
	isOver: boolean;
}) => {
	const { setNodeRef } = useDroppable({ id, data: { type: "slot" } });

	const baseBg = isOver ? "bg-yellow-200" : "bg-gray-700";
	const effectBg = effectValue > 0 ? "bg-yellow-400" : baseBg;
	const effectTextColor = effectValue > 0 ? "text-gray-900" : "text-gray-400";

	return (
		<div
			ref={setNodeRef}
			className={`w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg p-1 transition-colors ${effectBg}`}
		>
			{item ? (
				<SlabsComponent
					item={item}
					isDragging={false}
					onRotate={(e) => onRotate(item.id, e)}
				/>
			) : (
				effectValue > 0 && (
					<div
						className={`w-full h-full flex items-center justify-center text-2xl font-bold ${effectTextColor}`}
					>
						+{effectValue}
					</div>
				)
			)}
		</div>
	);
};
