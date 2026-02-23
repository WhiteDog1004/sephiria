import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { CostumeReq } from "../model/costume.types";
import type { CostumeRow } from "../model/costume.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getCostume = async ({ costume }: CostumeReq): Promise<CostumeRow> => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("costume")
		.select("created_at,id,image,uuid,value")
		.eq("value", costume)
		.single();

	handleError(error);
	if (!data) {
		throw new Error("Costume not found");
	}

	return data;
};
