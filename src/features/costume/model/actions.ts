import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getDetailList = async () => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("costume")
		.select("*")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
