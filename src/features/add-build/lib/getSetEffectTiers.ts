import { SETS_EFFECT_COUNT_LABEL } from "../config/getSetsEffect";

export const getAllActiveSetEffectTexts = (
	key: string,
	count: number,
): string[] => {
	const { tiers } = getSetEffectTiers(key);
	if (!tiers.length) return [];

	const activeTiers = tiers.filter((tier) => count >= tier);

	return activeTiers.map((tier) => SETS_EFFECT_COUNT_LABEL[key][tier]);
};

export const getSetEffectTiers = (key: string) => {
	const setEffects = SETS_EFFECT_COUNT_LABEL[key];
	if (!setEffects) {
		return { tiers: [], min: 0, max: 0 };
	}

	const tiers = Object.keys(setEffects)
		.map(Number)
		.sort((a, b) => a - b);

	return {
		tiers,
		min: tiers[0] || 0,
		max: tiers[tiers.length - 1] || 0,
	};
};

export const getActiveSetEffectText = (
	key: string,
	count: number,
): string | null => {
	const { tiers } = getSetEffectTiers(key);
	if (!tiers.length) return null;

	const activeTier = tiers
		.slice()
		.reverse()
		.find((tier) => count >= tier);

	if (activeTier) {
		return SETS_EFFECT_COUNT_LABEL[key][activeTier];
	}

	return null;
};
