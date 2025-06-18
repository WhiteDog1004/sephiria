export type CostumeType = {
	name: string;
	unlock?: string;
	story: string;
	options: string[];
};

export type CostumeMap = {
	[key: string]: CostumeType;
};
