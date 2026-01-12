import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import { ITEM_SLABS_DATA } from "@/src/features/simulator/config/slabsLists";
import { Box } from "@/src/shared/ui/box";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import type { ArtifactInstance, SlabsOptions } from "../../types";

export const generateGridConfig = (totalSlots?: number) => {
	if (!totalSlots) totalSlots = 34;
	if (totalSlots <= 0 || 6 <= 0) {
		return [];
	}

	const config: { rows: number; cols: number }[] = [];

	const fullRows = Math.floor(totalSlots / 6);
	const lastRowCols = totalSlots % 6;

	for (let i = 0; i < fullRows; i++) {
		config.push({ rows: i, cols: 6 });
	}

	if (lastRowCols > 0) {
		config.push({ rows: fullRows, cols: lastRowCols });
	}

	return config;
};

const DEFAULT_TOTAL_SLOTS = 34;

export const createCustomGrid = (totalSlots: number = DEFAULT_TOTAL_SLOTS) => {
	return generateGridConfig(totalSlots);
};

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
					src={getCloudflareUrl(item.image)}
					alt={"items"}
					className={clsx("object-contain")}
					style={item.rotation ? rotationStyle : undefined}
					unoptimized
				/>
				{item.type === "slabs" &&
					ITEM_SLABS_DATA.find((i) => i.value === item.id.split("-").pop())
						?.rotate && (
						<button
							type="button"
							onClick={onRotate}
							onPointerDown={(e) => e.stopPropagation()}
							className="absolute top-0 right-0 w-3 h-3 md:w-5 md:h-5 bg-black bg-opacity-50 rounded-full text-xs hover:bg-opacity-75 transition-colors flex items-center justify-center p-0.5 md:p-1"
							title="회전"
						>
							<RotateCcw />
						</button>
					)}
			</Box>
		</Box>
	);
};
