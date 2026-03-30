import { SETS_EFFECT_COUNT_LABEL } from "@/src/features/add-build/config/getSetsEffect";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import type { ComboItem } from "./types";

export const getComboLists = async (): Promise<ComboItem[]> => {
	return Object.entries(EFFECT_LABELS)
		.map(([key, label]) => {
			const setEffects = SETS_EFFECT_COUNT_LABEL[key] || {};
			const tiers = Object.keys(setEffects)
				.map(Number)
				.sort((a, b) => a - b);

			const effects = tiers.map((count) => ({
				count,
				effect: setEffects[count],
			}));

			return {
				key,
				label,
				image: `/combo/${key}.png`,
				minCount: tiers[0] || 0,
				maxCount: tiers[tiers.length - 1] || 0,
				effects,
			};
		})
		.filter((combo) => combo.effects.length > 0);
};
