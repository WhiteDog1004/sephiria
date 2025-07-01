import { GRID_CONFIG } from "@/src/entities/simulator/item/ui/Slabs";

type EffectHandler = (
	x: number,
	y: number,
	slotId: string,
	item: { rotation: number },
	effects: Record<string, number>,
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

	// approximation 근사
	approximation: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[
				{ dx: 0, dy: -1 },
				{ dx: 1, dy: 0 },
			],
			[
				{ dx: 1, dy: 0 },
				{ dx: 0, dy: 1 },
			],
			[
				{ dx: 0, dy: 1 },
				{ dx: -1, dy: 0 },
			],
			[
				{ dx: -1, dy: 0 },
				{ dx: 0, dy: -1 },
			],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += 1;
			}
		});
	},

	// dry 건조
	dry: (x, y, _, __, effects) => {
		const offsets = [`${y - 1}-${x}`, `${y + 1}-${x}`];
		offsets.forEach((slotId) => {
			if (effects[slotId] !== undefined) {
				effects[slotId] += 1;
			}
		});
	},

	// chivalry 기사도
	chivalry: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[{ dx: -1, dy: -2 }],
			[{ dx: 2, dy: -1 }],
			[{ dx: 1, dy: 2 }],
			[{ dx: -2, dy: 1 }],
		];

		const offsets = rotationOffsets[item.rotation];
		offsets.forEach(({ dx, dy }) => {
			const targetSlotId = `${y + dy}-${x + dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += 1;
			}
		});
	},

	// advent 도래
	advent: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[
				{ dx: 0, dy: -1 },
				{ dx: 0, dy: -2 },
				{ dx: 0, dy: 1, value: -1 },
				{ dx: 0, dy: 2, value: -1 },
			],
			[
				{ dx: 1, dy: 0 },
				{ dx: 2, dy: 0 },
				{ dx: -1, dy: 0, value: -1 },
				{ dx: -2, dy: 0, value: -1 },
			],
			[
				{ dx: 0, dy: 1 },
				{ dx: 0, dy: 2 },
				{ dx: 0, dy: -1, value: -1 },
				{ dx: 0, dy: -2, value: -1 },
			],
			[
				{ dx: -1, dy: 0 },
				{ dx: -2, dy: 0 },
				{ dx: 1, dy: 0, value: -1 },
				{ dx: 2, dy: 0, value: -1 },
			],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += offset.value || 1;
			}
		});
	},

	// linear 선의
	linear: (x, y, _, __, effects) => {
		const maxCols = Math.max(...GRID_CONFIG.map((row) => row.cols));
		const MAX_ROW_PER_COLUMN: number[] = [];
		for (let col = 0; col < maxCols; col++) {
			let maxRow = -1;
			for (let rowIdx = 0; rowIdx < GRID_CONFIG.length; rowIdx++) {
				if (col < GRID_CONFIG[rowIdx].cols) {
					maxRow = rowIdx;
				}
			}
			MAX_ROW_PER_COLUMN.push(maxRow);
		}

		if (y === MAX_ROW_PER_COLUMN[x]) {
			const targetSlots = [`${y}-${x - 1}`, `${y}-${x + 1}`];
			targetSlots.forEach((slotId) => {
				if (effects[slotId] !== undefined) {
					effects[slotId] += 1;
				}
			});
		}
	},

	// sight 시선
	sight: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[
				{ dx: -1, dy: -1 },
				{ dx: 1, dy: 1, value: -1 },
			],
			[
				{ dx: 1, dy: -1 },
				{ dx: -1, dy: 1, value: -1 },
			],
			[
				{ dx: 1, dy: 1 },
				{ dx: -1, dy: -1, value: -1 },
			],
			[
				{ dx: -1, dy: 1 },
				{ dx: 1, dy: -1, value: -1 },
			],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += offset.value || 1;
			}
		});
	},

	// handshake 악수
	handshake: (x, y, _, item, effects) => {
		if (item.rotation === 0 || item.rotation === 2) {
			const offsets = [`${y - 1}-${x}`, `${y + 1}-${x}`];
			offsets.forEach((slotId) => {
				if (effects[slotId] !== undefined) {
					effects[slotId] += 1;
				}
			});
		} else {
			const offsets = [`${y}-${x - 1}`, `${y}-${x + 1}`];
			offsets.forEach((slotId) => {
				if (effects[slotId] !== undefined) {
					effects[slotId] += 1;
				}
			});
		}
	},

	// fate 운명
	fate: (x, y, _, __, effects) => {
		const offsets = [`${y + 1}-${x}`];

		offsets.forEach((slotId) => {
			if (effects[slotId] !== undefined) {
				effects[slotId] += 1;
			}
		});
	},

	// wit 재치
	wit: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[{ dx: -1, dy: -1 }],
			[{ dx: 1, dy: -1 }],
			[{ dx: 1, dy: 1 }],
			[{ dx: -1, dy: 1 }],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += 1;
			}
		});
	},

	// exploitation 착취
	exploitation: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[
				{ dx: 0, dy: -1 },
				{ dx: 0, dy: 1, value: -1 },
			],
			[
				{ dx: 1, dy: 0 },
				{ dx: -1, dy: 0, value: -1 },
			],
			[
				{ dx: 0, dy: 1 },
				{ dx: 0, dy: -1, value: -1 },
			],
			[
				{ dx: -1, dy: 0 },
				{ dx: 1, dy: 0, value: -1 },
			],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += offset.value || 1;
			}
		});
	},

	// exploitation 착취
	unity: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[
				{ dx: 1, dy: 0 },
				{ dx: 0, dy: 1 },
				{ dx: 0, dy: -1, value: -1 },
				{ dx: -1, dy: 0, value: -1 },
			],
			[
				{ dx: 0, dy: 1 },
				{ dx: -1, dy: 0 },
				{ dx: 0, dy: -1, value: -1 },
				{ dx: 1, dy: 0, value: -1 },
			],
			[
				{ dx: -1, dy: 0 },
				{ dx: 0, dy: -1 },
				{ dx: 0, dy: 1, value: -1 },
				{ dx: 1, dy: 0, value: -1 },
			],
			[
				{ dx: 0, dy: -1 },
				{ dx: 1, dy: 0 },
				{ dx: 0, dy: 1, value: -1 },
				{ dx: -1, dy: 0, value: -1 },
			],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += offset.value || 1;
			}
		});
	},

	// cheer 환호
	cheer: (x, y, _, __, effects) => {
		const offsets = [`${y - 1}-${x}`];

		offsets.forEach((slotId) => {
			if (effects[slotId] !== undefined) {
				effects[slotId] += 1;
			}
		});
	},

	// hope 희망
	hope: (x, y, _, item, effects) => {
		const rotationOffsets = [
			[{ dx: 1, dy: 0 }],
			[{ dx: 0, dy: 1 }],
			[{ dx: -1, dy: 0 }],
			[{ dx: 0, dy: -1 }],
		];

		const offsets = rotationOffsets[item.rotation];

		offsets.forEach((offset) => {
			const targetSlotId = `${y + offset.dy}-${x + offset.dx}`;
			if (effects[targetSlotId] !== undefined) {
				effects[targetSlotId] += 1;
			}
		});
	},
};
