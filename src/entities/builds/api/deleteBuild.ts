import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const deleteBuild = async (postUuid: string): Promise<string> => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("builds")
		.delete()
		.eq("postUuid", postUuid);

	handleError(error);

	return data as any;
};
