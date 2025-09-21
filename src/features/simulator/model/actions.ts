import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
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

export const getClientArtifactLists = async () => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("artifacts")
		.select("*")
		.order("id", { ascending: true });

	handleError(error);

	return data;
};
