import type { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type BuildDetailProps = {
	id: string;
};

const handleError = (error: PostgrestError | null) => {
	if (error) {
		return notFound();
	}
};

export const getBuildDetail = async ({ id }: BuildDetailProps) => {
	const supabase = await createServerSupabaseClient();

	const { data, error } = await supabase
		.from("builds")
		.select("*")
		.eq("postUuid", id)
		.single();

	handleError(error);

	return { data };
};
