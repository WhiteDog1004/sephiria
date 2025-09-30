import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MiracleReq } from "../model/types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getMiracle = async ({ miracle }: MiracleReq) => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("*")
		.eq("value", miracle)
		.single();

	handleError(error);

	return data;
};

export const getMiracleDatas = async () => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("*")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};

export const getClientMiracleDatas = async () => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("*")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
