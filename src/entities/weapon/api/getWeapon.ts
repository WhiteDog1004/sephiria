import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { WeaponReq, WeaponRow } from "../model/types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getWeapon = async ({ weapon }: WeaponReq): Promise<WeaponRow> => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("weapons")
		.select("created_at,id,image,value_kor,value,uuid,effects,parent,tier,disabled")
		.eq("value", weapon)
		.or("disabled.is.null,disabled.eq.false")
		.single();

	handleError(error);
	if (!data) {
		throw new Error("Weapon not found");
	}

	return data;
};
