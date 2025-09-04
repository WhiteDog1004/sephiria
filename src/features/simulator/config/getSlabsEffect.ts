import {
	calculateRotatedEffects,
	getRotateValue,
} from "../lib/calculateEffects";

export type GridConfig = { rows: number; cols: number }[];
type EffectHandler = (
	x: number,
	y: number,
	slotId: string,
	item: { rotation: number },
	effects: Record<string, number>,
	flag?: Record<string, "ignore" | null>,
	gridConfig?: GridConfig,
) => void;

// 석판 효과
export const getSlabsEffectHandlers: Record<string, EffectHandler> = {
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
	linear: (x, y, _, __, effects, ___, gridConfig) => {
		if (!gridConfig) return;
		const currentGrid = gridConfig;

		const lastRowIndex = currentGrid[currentGrid.length - 1].rows;

		if (y === lastRowIndex) {
			const targetSlots = [`${y}-${x - 1}`, `${y}-${x + 1}`];

			targetSlots.forEach((slotId) => {
				if (
					effects[slotId] !== undefined &&
					typeof effects[slotId] === "number"
				) {
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

	// past 과거
	past: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: -1 },
			{ dx: 1, dy: 0 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// future 미래
	future: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: -1 },
			{ dx: -1, dy: 0 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// distribution 분배
	distribution: (x, y, _, __, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: -1, dy: 0 },
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// triceps 삼두
	triceps: (x, y, _, __, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: -1, dy: 0 },
			{ dx: 1, dy: 0 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// harvesting 수확
	harvesting: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: 1, value: 2 },
			{ dx: 0, dy: -1, value: 2 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// binary_star 쌍성
	binary_star: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: 2, value: 2 },
			{ dx: 0, dy: -2, value: 2 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// nurture 양육
	nurture: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: -1 },
			{ dx: 0, dy: 1, value: -1 },
			{ dx: 0, dy: 2, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// yearning 열망
	yearning: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: 0, dy: -1, value: 2 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// agglutination 응집
	agglutination: (x, y, slotId, item, effects, _, gridConfig) => {
		if (!gridConfig) return;
		if (item.rotation === 1 || item.rotation === 3) {
			for (let i = 0; i < gridConfig.length; i++) {
				if (x < gridConfig[i].cols) {
					const targetSlotId = `${i}-${x}`;
					if (
						targetSlotId !== slotId &&
						typeof effects[targetSlotId] === "number"
					) {
						effects[targetSlotId] += -1;
					}
				}
			}
		} else {
			const colsInRow = gridConfig[y].cols;
			for (let i = 0; i < colsInRow; i++) {
				const targetSlotId = `${y}-${i}`;
				if (
					targetSlotId !== slotId &&
					typeof effects[targetSlotId] === "number"
				) {
					effects[targetSlotId] += -1;
				}
			}
		}
		const baseOffsets = [{ dx: 0, dy: -1, value: 3 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// entrance 입구
	entrance: (x, y, _, __, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1, value: 2 },
			{ dx: -1, dy: -1, value: 1 },
			{ dx: 1, dy: -1, value: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects);
	},

	// joke 장난
	joke: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: -1 },
			{ dx: -1, dy: -1 },
			{ dx: -1, dy: 0, value: -1 },
			{ dx: 1, dy: 0, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// load 적재
	load: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: -1, dy: -1 },
			{ dx: 0, dy: -2 },
			{ dx: -1, dy: -2 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// transition 전이
	transition: (x, y, slotId, item, effects, _, gridConfig) => {
		let horizontalValue: number;
		let verticalValue: number;

		if (item.rotation === 1 || item.rotation === 3) {
			horizontalValue = -1;
			verticalValue = 1;
		} else {
			horizontalValue = 1;
			verticalValue = -1;
		}

		if (!gridConfig) return;
		const colsInRow = gridConfig[y].cols;
		for (let i = 0; i < colsInRow; i++) {
			const targetSlotId = `${y}-${i}`;
			if (
				targetSlotId !== slotId &&
				typeof effects[targetSlotId] === "number"
			) {
				effects[targetSlotId] += horizontalValue;
			}
		}

		for (let i = 0; i < gridConfig.length; i++) {
			if (x < gridConfig[i].cols) {
				const targetSlotId = `${i}-${x}`;
				if (
					targetSlotId !== slotId &&
					typeof effects[targetSlotId] === "number"
				) {
					effects[targetSlotId] += verticalValue;
				}
			}
		}
	},

	// advance 전진
	advance: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1 },
			{ dx: 0, dy: -2 },
			{ dx: 0, dy: -3 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// justice 정의
	justice: (x, y, slotId, __, effects, ___, gridConfig) => {
		if (!gridConfig) return;
		const colsInCurrentRow = gridConfig[y].cols;
		const isEdge = x === 0 || x === colsInCurrentRow - 1;

		if (isEdge) {
			for (let i = 0; i < gridConfig.length; i++) {
				if (x < gridConfig[i].cols) {
					const targetSlotId = `${i}-${x}`;
					if (
						targetSlotId !== slotId &&
						typeof effects[targetSlotId] === "number"
					) {
						effects[targetSlotId] += 1;
					}
				}
			}
		}
	},

	// preparation 준비
	preparation: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: 1, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// exit 출구
	exit: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: 1 },
			{ dx: 0, dy: 1, value: 2 },
			{ dx: 1, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// tide 파도
	tide: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 1, dy: -1, value: 2 },
			{ dx: 0, dy: -1, value: -1 },
			{ dx: 1, dy: 0, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// dedication 헌정
	dedication: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 1, dy: -1 },
			{ dx: -1, dy: -1 },
			{ dx: 1, dy: 1 },
			{ dx: -1, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// RARE
	// base 기반
	base: (_, y, slotId, __, effects, ___, gridConfig) => {
		if (!gridConfig) return;
		const colsInRow = gridConfig[y].cols;
		for (let i = 0; i < colsInRow; i++) {
			const targetSlotId = `${y}-${i}`;
			if (targetSlotId !== slotId) {
				effects[targetSlotId] += 1;
			}
		}
	},

	// warrant 권능
	warrant: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: 0, dy: -1, value: 3 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// disconnection 단절
	disconnection: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1, value: 3 },
			{ dx: 0, dy: 1, value: 3 },
			{ dx: 1, dy: 0, value: -1 },
			{ dx: -1, dy: 0, value: -1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// concurrency 동시성
	concurrency: (x, _, slotId, __, effects, ___, gridConfig) => {
		if (!gridConfig) return;
		const colsInRow = gridConfig.length;
		for (let i = 0; i < colsInRow; i++) {
			const targetSlotId = `${i}-${x}`;
			if (targetSlotId !== slotId) {
				effects[targetSlotId] += 1;
			}
		}
	},

	// vow 맹세
	vow: (x, y, __, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -2, value: 2 },
			{ dx: 0, dy: 1 },
			{ dx: 0, dy: -1 },
			{ dx: -1, dy: 0 },
			{ dx: 1, dy: 0 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// rebellion 반항
	rebellion: (x, y, __, item, effects) => {
		const cx = item.rotation === 1 || item.rotation === 3 ? -1 : 1;
		const directions = [
			[cx, -1],
			[-cx, 1],
		];

		directions.forEach(([dx, dy]) => {
			let currentX = x;
			let currentY = y;

			while (true) {
				currentX += dx;
				currentY += dy;

				const targetSlotId = `${currentY}-${currentX}`;

				if (
					effects[targetSlotId] !== undefined &&
					typeof effects[targetSlotId] === "number"
				) {
					effects[targetSlotId] += 1;
				} else {
					break;
				}
			}
		});
	},

	// connection 이음
	connection: (x, y, _, item, effects, flag) => {
		const effectForValue = { dx: 0, dy: -1, value: 2 };
		const effectForIgnore = { dx: 0, dy: 1, flag: "ignore" };

		const { newDx: valueDx, newDy: valueDy } = getRotateValue(
			effectForValue.dx,
			effectForValue.dy,
			item.rotation,
		);
		const targetSlotValue = `${y + valueDy}-${x + valueDx}`;

		if (
			effects[targetSlotValue] !== undefined &&
			typeof effects[targetSlotValue] === "number"
		) {
			effects[targetSlotValue] += effectForValue.value;
		}

		const { newDx: ignoreDx, newDy: ignoreDy } = getRotateValue(
			effectForIgnore.dx,
			effectForIgnore.dy,
			item.rotation,
		);
		const targetSlotIgnore = `${y + ignoreDy}-${x + ignoreDx}`;

		if (flag && flag[targetSlotIgnore] !== undefined) {
			flag[targetSlotIgnore] = "ignore";
		}
	},

	// shade 차양
	shade: (_, y, __, ___, effects, _____, gridConfig) => {
		if (!gridConfig) return;
		if (y === 0) {
			const bottomRowConfig = gridConfig[gridConfig?.length - 1];
			const bottomRowIndex = bottomRowConfig.rows;
			const colsInBottomRow = bottomRowConfig.cols;

			for (let colIdx = 0; colIdx < colsInBottomRow; colIdx++) {
				const targetSlotId = `${bottomRowIndex}-${colIdx}`;
				if (
					effects[targetSlotId] !== undefined &&
					typeof effects[targetSlotId] === "number"
				) {
					effects[targetSlotId] += 1;
				}
			}
		}
	},

	// LEGEND
	// thorn 가시
	thorn: (x, y, __, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1, value: 2 },
			{ dx: 0, dy: 1, value: 2 },
			{ dx: -1, dy: -1 },
			{ dx: -1, dy: 0 },
			{ dx: -1, dy: 1 },
			{ dx: 1, dy: -1 },
			{ dx: 1, dy: 0 },
			{ dx: 1, dy: 1 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// boundary 경계
	boundary: (_, __, ___, ____, effects, _____, gridConfig) => {
		if (!gridConfig) return;
		const currentGrid = gridConfig;
		const applyEffectToRow = (rowConfig: { rows: number; cols: number }) => {
			const rowIndex = rowConfig.rows;
			const colsInRow = rowConfig.cols;

			for (let colIdx = 0; colIdx < colsInRow; colIdx++) {
				const targetSlotId = `${rowIndex}-${colIdx}`;
				if (
					effects[targetSlotId] !== undefined &&
					typeof effects[targetSlotId] === "number"
				) {
					effects[targetSlotId] += 1;
				}
			}
		};

		const topRowConfig = currentGrid[0];
		const bottomRowConfig = currentGrid[currentGrid.length - 1];

		applyEffectToRow(topRowConfig);
		applyEffectToRow(bottomRowConfig);
	},

	// sheen 광휘
	sheen: (x, y, slotId, item, effects, _, gridConfig) => {
		if (!gridConfig) return;
		if (item.rotation === 1 || item.rotation === 3) {
			const colsInRow = gridConfig.length;
			for (let i = 0; i < colsInRow; i++) {
				const targetSlotId = `${i}-${x}`;
				if (targetSlotId !== slotId) {
					effects[targetSlotId] += 1;
				}
			}
		} else {
			const colsInRow = gridConfig[y].cols;
			for (let i = 0; i < colsInRow; i++) {
				const targetSlotId = `${y}-${i}`;
				if (targetSlotId !== slotId) {
					effects[targetSlotId] += 1;
				}
			}
		}

		const baseOffsets = [
			{ dx: 0, dy: -1, value: 2 },
			{ dx: 0, dy: 1, value: 2 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// miracle 기적
	miracle: (x, y, slotId, _, effects, __, gridConfig) => {
		if (!gridConfig) return;
		const rows = gridConfig.length;
		const cols = gridConfig[y].cols;
		for (let i = 0; i < rows; i++) {
			const targetSlotId = `${i}-${x}`;
			if (targetSlotId !== slotId) {
				effects[targetSlotId] += 1;
			}
		}
		for (let i = 0; i < cols; i++) {
			const targetSlotId = `${y}-${i}`;
			if (targetSlotId !== slotId) {
				effects[targetSlotId] += 1;
			}
		}
	},

	// daydream 백일몽
	daydream: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: -1, dy: -1 },
			{ dx: -1, dy: -2 },
			{ dx: 1, dy: -1 },
			{ dx: 1, dy: -2 },
			{ dx: -1, dy: 1 },
			{ dx: -1, dy: 2 },
			{ dx: 1, dy: 1 },
			{ dx: 1, dy: 2 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// compression 압축
	compression: (x, y, _, item, effects) => {
		const baseOffsets = [
			{ dx: 0, dy: -1, value: 3 },
			{ dx: 0, dy: -2, value: 2 },
			{ dx: 0, dy: -3 },
		];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},

	// assurance 확신
	assurance: (x, y, _, item, effects) => {
		const baseOffsets = [{ dx: 0, dy: -1, value: 5 }];
		return calculateRotatedEffects(baseOffsets, x, y, effects, item);
	},
};
