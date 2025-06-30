import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import { ITEM_MASTER_DATA } from "@/src/features/simulator/config/SlabsLists";
import type { SlabsOptions } from "../../types";

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

// 석판 기준으로 효과 설정이 필요할 때 + 슬롯 한칸만 효과를 줘야할 때
export const EFFECT_OFFSETS: Record<
	string,
	Record<number, { dx: number; dy: number }[]>
> = {
	chivalry: {
		0: [{ dx: -1, dy: -2 }], // 기본: 왼쪽 1, 위 2
		1: [{ dx: 2, dy: -1 }],
		2: [{ dx: 1, dy: 2 }],
		3: [{ dx: -2, dy: 1 }],
	},
};

export const SlabsComponent = ({
	item,
	isDragging,
	onRotate,
}: {
	item: SlabsOptions;
	isDragging: boolean;
	onRotate: (e: React.MouseEvent) => void;
}) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: item.id,
		data: { type: "item", item },
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				zIndex: 10,
			}
		: {};

	const rotationStyle = {
		transform: `rotate(${item.rotation * 90}deg)`,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`relative w-full h-full p-1 rounded-md cursor-grab active:cursor-grabbing transition-shadow ${isDragging ? "shadow-2xl" : "shadow-md"}`}
		>
			<div
				className={`w-full h-full rounded flex items-center justify-center text-white font-bold `}
			>
				<Image fill src={item.image} alt={"slabs"} style={rotationStyle} />
				{ITEM_MASTER_DATA.find((i) => i.value === item.id.split("-").pop())
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
			</div>
		</div>
	);
};
