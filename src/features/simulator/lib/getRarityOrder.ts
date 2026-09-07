export type Rarity =
	| "common"
	| "advanced"
	| "rare"
	| "legend"
	| "eternity"
	| "solid";

export const rarityOrder: Record<Rarity, number> = {
	common: 0,
	advanced: 1,
	rare: 2,
	legend: 3,
	eternity: 4,
	solid: 5,
};

export const getRarityValue = (rarity: Rarity) => {
	return rarityOrder[rarity];
};
