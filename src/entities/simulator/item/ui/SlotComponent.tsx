import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import Image from "next/image";
import { ITEM_SLABS_DATA } from "@/src/features/simulator/config/slabsLists";
import { Box } from "@/src/shared/ui/box";
import type { ArtifactInstance, SlabsOptions } from "../../types";

// 인벤토리 그리드 설정 (가변적인 형태 지원)
export const GRID_CONFIG: { rows: number; cols: number }[] = [
	{ rows: 0, cols: 6 },
	{ rows: 1, cols: 6 },
	{ rows: 2, cols: 6 },
	{ rows: 3, cols: 6 },
	{ rows: 4, cols: 6 },
	{ rows: 5, cols: 4 },
];

export const GRID_ROWS = GRID_CONFIG.length;
export const SLOT_IDS = GRID_CONFIG.flatMap(({ rows, cols }) =>
	Array.from({ length: cols }, (_, colIndex) => `${rows}-${colIndex}`),
);

export const SlotComponent = ({
	item,
	isDragging,
	onRotate,
}: {
	item: SlabsOptions & ArtifactInstance;
	isDragging: boolean;
	onRotate: (e: React.MouseEvent) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: item.type === "slabs" ? item.id : item.instanceId,
		data: { type: "item", item },
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: {};

	const rotationStyle = {
		transform: `rotate(${item.rotation * 90}deg)`,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`relative w-full h-full p-1 rounded-md cursor-grab active:cursor-grabbing transition-shadow z-10 ${isDragging ? "shadow-2xl" : "shadow-md"}`}
		>
			<Box
				className={`w-full h-full p-0 rounded flex items-center justify-center text-white font-bold `}
			>
				<Image
					fill
					src={item.image}
					alt={"items"}
					className={clsx("object-contain")}
					style={item.rotation ? rotationStyle : undefined}
				/>
				{item.type === "slabs" &&
					ITEM_SLABS_DATA.find((i) => i.value === item.id.split("-").pop())
						?.rotate && (
						<button
							type="button"
							onClick={onRotate}
							onPointerDown={(e) => e.stopPropagation()}
							className="absolute top-0 right-0 w-5 h-5 bg-black bg-opacity-50 rounded-full text-xs hover:bg-opacity-75 transition-colors flex items-center justify-center"
							title="회전"
						>
							↻
						</button>
					)}
			</Box>
		</Box>
	);
};
