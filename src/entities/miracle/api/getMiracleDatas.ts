import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MiracleReq } from "../model/types";
import type { MiracleRow } from "../model/types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getMiracle = async ({ miracle }: MiracleReq): Promise<MiracleRow> => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("id,uuid,created_at,value,value_kor,image,effects")
		.eq("value", miracle)
		.single();

	handleError(error);
	if (!data) {
		throw new Error("Miracle not found");
	}

	return data;
};

export const getMiracleDatas = async () => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("id,uuid,created_at,value,value_kor,image,effects")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};

export const getClientMiracleDatas = async () => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("miracle")
		.select("id,uuid,created_at,value,value_kor,image,effects")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
