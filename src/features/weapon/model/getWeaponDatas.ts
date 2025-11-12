import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getWeaponLists = async () => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("weapons")
		.select("*")
		.or("disabled.is.null,disabled.eq.false")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};

export const getClientWeaponLists = async () => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("weapons")
		.select("*")
		.or("disabled.is.null,disabled.eq.false")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
