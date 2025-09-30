import type { Database } from "@/types_db";

export interface WeaponOptions {
	created_at: string;
	id: number;
	image: string | null;
	value_kor: string;
	value: string;
	uuid: string;
	effects: {
		reward: string[];
		penalty?: string[];
	};
	parent?: string;
	tier: number;
}

export type WeaponSelectType = {
	tier: number;
	parent: string | null;
};

export type WeaponReq = {
	weapon: string;
};

export type WeaponRow = Database["public"]["Tables"]["weapons"]["Row"];
