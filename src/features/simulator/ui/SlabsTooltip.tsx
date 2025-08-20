import { useMemo } from "react";
import { generateGridConfig } from "@/src/entities/simulator/item/ui/SlotComponent";
import type { SlabsOptions, SlotId } from "@/src/entities/simulator/types";
import { Badge } from "@/src/shared/ui/badge";
import { Box } from "@/src/shared/ui/box";
import { getSlabsEffectHandlers } from "../config/getSlabsEffect";
import { useSlabsEffects } from "../model/useSlabsEffects";

interface SlabEffectTooltipProps {
	slab: SlabsOptions;
}

const MINI_GRID_CONFIG = [
	{ rows: 0, cols: 5 },
	{ rows: 1, cols: 5 },
	{ rows: 2, cols: 5 },
	{ rows: 3, cols: 5 },
	{ rows: 4, cols: 5 },
];

export const SlabEffectTooltip = ({ slab }: SlabEffectTooltipProps) => {
	const { slotNum } = useSlabsEffects();
	const calculatedEffects = useMemo(() => {
		const SIMULATION_POSITIONS: Record<string, { x: number; y: number }> = {
			linear: { x: 2, y: 4 },
			shade: { x: 2, y: 0 },
			justice: { x: 0, y: 2 },
			compression: { x: 2, y: 3 },
		};
		const effects: Record<SlotId, number> = {};
		const flag: Record<SlotId, "ignore" | null> = {};

		for (let y = 0; y < generateGridConfig(slotNum).length; y++) {
			for (let x = 0; x < generateGridConfig(slotNum).length; x++) {
				effects[`${y}-${x}`] = 0;
				flag[`${y}-${x}`] = null;
			}
		}

		const itemType = slab.id;
		const defaultPosition = { x: 2, y: 2 };
		const { x: currentX, y: currentY } =
			SIMULATION_POSITIONS[itemType] || defaultPosition;
		const currentSlotId: SlotId = `${currentY}-${currentX}`;
		const handler = getSlabsEffectHandlers[itemType];

		if (handler) {
			handler(
				currentX,
				currentY,
				currentSlotId,
				slab,
				effects,
				flag,
				MINI_GRID_CONFIG,
			);
		}

		return { effects, flag, currentSlotId };
	}, [slab, slotNum]);

	return (
		<Box className="relative grid grid-cols-5 gap-1 p-2 rounded-sm bg-gray-800 border border-gray-700">
			{Array.from({ length: 5 }).map((_, rowIndex) =>
				Array.from({ length: 5 }).map((_, colIndex) => {
					const slotId: SlotId = `${rowIndex}-${colIndex}`;
					const slotPosition = slotId === calculatedEffects.currentSlotId;
					const effectValue = calculatedEffects.effects[slotId] || 0;
					const effectFlag = calculatedEffects.flag[slotId];

					const getBgColorClass = () => {
						if (effectFlag === "ignore") return "bg-purple-600";
						if (effectValue > 0) return "bg-green-500";
						if (effectValue < 0) return "bg-red-500";
						return "bg-gray-600";
					};
					const displayText =
						effectValue > 0
							? `+${effectValue}`
							: effectValue < 0
								? effectValue
								: "";

					return (
						<Box
							key={slotId}
							className={`flex p-2 items-center justify-center rounded-xs w-3 h-3 text-white text-[10px] ${getBgColorClass()}`}
						>
							{slotPosition ? "★" : displayText}
						</Box>
					);
				}),
			)}
			{slab.rotation !== undefined && (
				<Badge className="absolute -bottom-2 -right-2 w-5 h-5 p-1 rounded-full bg-yellow-500">
					↻
				</Badge>
			)}
		</Box>
	);
};
