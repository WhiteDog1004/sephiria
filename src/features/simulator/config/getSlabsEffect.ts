import { GRID_CONFIG } from "@/src/entities/simulator/item/ui/Slabs";
import {
	calculateRotatedEffects,
	getRotateValue,
} from "../lib/calculateEffects";

type EffectHandler = (
	x: number,
	y: number,
	slotId: string,
	item: { rotation: number },
	effects: Record<string, number>,
	flag?: Record<string, "ignore" | null>,
) => void;

// 석판 효과
export const getSlabsEffectHandlers: Record<string, EffectHandler> = {
	// base 기반
	base: (x, y, slotId, _, effects) => {
		const colsInRow = GRID_CONFIG[y].cols;
		for (let i = 0; i < colsInRow; i++) {
			const targetSlotId = `${y}-${i}`;
			if (targetSlotId !== slotId) {
				effects[targetSlotId] += 1;
			}
		}
	},

	// COMMON
	// approximation 근사
	approximation: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: 0 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// dry 건조
	dry: (x, y, _, __, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// chivalry 기사도
	chivalry: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: -1, dy: -2 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// advent 도래
	advent: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: -2 },
			{ dx: 0, dy: 1, value: -1 },
			{ dx: 0, dy: 2, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// linear 선의
	linear: (x, y, _, __, effects, flag) => {
		const maxCols = Math.max(...GRID_CONFIG.map((row) => row.cols));
		const MAX_ROW_PER_COLUMN: number[] = [];
		const targetSlots = [`${y}-${x - 1}`, `${y}-${x + 1}`];
		if (flag?.[`${y}-${x}`] !== "ignore") {
			for (let col = 0; col < maxCols; col++) {
				let maxRow = -1;
				for (let rowIdx = 0; rowIdx < GRID_CONFIG.length; rowIdx++) {
					if (col < GRID_CONFIG[rowIdx].cols) {
						maxRow = rowIdx;
					}
				}
				MAX_ROW_PER_COLUMN.push(maxRow);
			}
		}
		if (y === MAX_ROW_PER_COLUMN[x] || flag?.[`${y}-${x}`] === "ignore") {
			targetSlots.forEach((slotId) => {
				if (effects[slotId] !== undefined) {
					effects[slotId] += 1;
				}
			});
		}
	},

	// sight 시선
	sight: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: 1, dy: 1, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// handshake 악수
	handshake: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// fate 운명
	fate: (x, y, _, __, effects) => {
		const baseOffsets = [{ dx: 0, dy: 1 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// wit 재치
	wit: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: -1, dy: -1 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// exploitation 착취
	exploitation: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: 1, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// unity 화합
	unity: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
			{ dx: 0, dy: -1, value: -1 },
			{ dx: -1, dy: 0, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// cheer 환호
	cheer: (x, y, _, __, effects) => {
		const baseOffsets = [{ dx: 0, dy: -1 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// hope 희망
	hope: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: 1, dy: 0 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// ADVANCED
	// compete 경쟁
	compete: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: 1, value: 2 },
			{ dx: 0, dy: -1, value: -1 },
			{ dx: -1, dy: -1, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// beating 고동
	beating: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: 0, dy: -2, value: 2 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// home-town 고양
	home_town: (x, y, _, item, __, flag) => {
		const baseOffset = { dx: 1, dy: 0 };

		const { newDx, newDy } = getRotateValue(
			baseOffset.dx,
			baseOffset.dy,
			item.rotation,
		);

		const targetSlotId = `${y + newDy}-${x + newDx}`;

		if (flag && flag[targetSlotId] !== undefined) {
			flag[targetSlotId] = "ignore";
		}
	},
};
