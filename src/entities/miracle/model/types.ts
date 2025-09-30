import type { Database } from "@/types_db";

export interface MiracleOptions {
	data: {
		created_at: string;
		id: number;
		image: string | null;
		value_kor: string;
		value: string;
		uuid: string;
		effects: {
			reward?: string[];
			penalty?: string[];
		};
	}[];
}

export type MiracleReq = {
	miracle: string;
};

export type MiracleRow = Database["public"]["Tables"]["miracle"]["Row"];
