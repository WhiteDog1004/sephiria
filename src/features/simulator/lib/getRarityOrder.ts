export type Rarity = "common" | "advanced" | "rare" | "legend";

export const rarityOrder: Record<Rarity, number> = {
	common: 0,
	advanced: 1,
	rare: 2,
	legend: 3,
};

export const getRarityValue = (rarity: Rarity) => {
	return rarityOrder[rarity];
};
