import {
	EFFECT_OFFSETS,
	GRID_CONFIG,
} from "@/src/entities/simulator/item/ui/Slabs";

type EffectHandler = (
	x: number,
	y: number,
	slotId: string,
	item: { rotation: number },
	effects: Record<string, number>,
) => void;

export const getSlabsEffectHandlers: Record<string, EffectHandler> = {
	base: (x, y, slotId, item, effects) => {
		if (item.rotation === 1 || item.rotation === 3) {
			// 세로 방향
			for (let i = 0; i < GRID_CONFIG.length; i++) {
				if (x < GRID_CONFIG[i].cols) {
					const targetSlotId = `${i}-${x}`;
					if (targetSlotId !== slotId) {
						effects[targetSlotId] += 1;
					}
				}
			}
		} else {
			// 가로 방향
			const colsInRow = GRID_CONFIG[y].cols;
			for (let i = 0; i < colsInRow; i++) {
				const targetSlotId = `${y}-${i}`;
				if (targetSlotId !== slotId) {
					effects[targetSlotId] += 1;
				}
			}
		}
	},

	dry: (x, y, _, __, effects) => {
		const candidates = [
			`${y - 1}-${x}`,
			`${y + 1}-${x}`,
			// `${y}-${x - 1}`,
			// `${y}-${x + 1}`,
		];
		candidates.forEach((slotId) => {
			if (effects[slotId] !== undefined) {
				effects[slotId] += 1;
			}
		});
	},

	chivalry: (x, y, _, item, effects) => {
		const offsets = EFFECT_OFFSETS.chivalry[item.rotation];
		offsets.forEach(({ dx, dy }) => {
			const targetSlotId = `${y + dy}-${x + dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += 1;
			}
		});
	},
};
