import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { WeaponReq } from "../model/types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getWeapon = async ({ weapon }: WeaponReq) => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("weapons")
		.select("*")
		.eq("value", weapon)
		.single();

	handleError(error);

	return data;
};
