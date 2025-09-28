import type { Database } from "@/types_db";

export type CostumeReq = {
	costume: string;
};

export type CostumeRow = Database["public"]["Tables"]["costume"]["Row"];
