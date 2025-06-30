import { Database } from "@/types_db";

export type CostumeType = {
	name: string;
	unlock?: string;
	story: string;
	options: string[];
};

export type CostumeMap = {
	[key: string]: CostumeType;
};

export type CostumeDataType = Database["public"]["Tables"]["costume"]["Row"][];
