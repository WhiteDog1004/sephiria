import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";

export const FRUIT_SKEWER_SPECIAL_KEY = "adaptive_drop_bonus";
export const FRUIT_SKEWER_SPECIAL_LABEL = "적응형";

export const FRUIT_SKEWER_MAX_POINTS = 6;

export const FRUIT_SKEWER_OPTIONS = [
	{ value: FRUIT_SKEWER_SPECIAL_KEY, label: FRUIT_SKEWER_SPECIAL_LABEL },
	...Object.entries(EFFECT_LABELS).map(([value, label]) => ({ value, label })),
];

export const getFruitSkewerLabel = (key: string) => {
	if (key === FRUIT_SKEWER_SPECIAL_KEY) return FRUIT_SKEWER_SPECIAL_LABEL;
	return EFFECT_LABELS[key] || key;
};

export const getFruitSkewerValueOptions = (key: string) => {
	if (key === FRUIT_SKEWER_SPECIAL_KEY) {
		return [{ value: 1, label: "+1 (50%)" }];
	}

	return [-2, -1, 1, 2, 3].map((value) => ({
		value,
		label: `${value > 0 ? "+" : ""}${value} (${value > 0 ? "+" : ""}${value * 50}%)`,
	}));
};

export const getFruitSkewerChanceText = (value: number) => {
	const chance = value * 50;
	return `${chance > 0 ? "+" : ""}${chance}%`;
};
