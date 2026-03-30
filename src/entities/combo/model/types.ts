export type ComboEffectTier = {
	count: number;
	effect: string;
};

export type ComboItem = {
	key: string;
	label: string;
	image: string;
	minCount: number;
	maxCount: number;
	effects: ComboEffectTier[];
};
