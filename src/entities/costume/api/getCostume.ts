import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { CostumeReq } from "../model/costume.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getCostume = async ({ costume }: CostumeReq) => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("costume")
		.select("*")
		.eq("value", costume)
		.single();

	handleError(error);

	return data;
};
