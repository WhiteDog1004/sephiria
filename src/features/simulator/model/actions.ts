import type { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const getArtifactLists = async () => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("artifacts")
		.select("*")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
