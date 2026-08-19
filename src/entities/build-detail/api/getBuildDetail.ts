import { notFound } from "next/navigation";
import { createServerSupabaseAdminClient } from "@/lib/supabase/server";
import { getBuildDetailCached } from "@/src/entities/builds/api/buildsCache";

type BuildDetailProps = {
	id: string;
};

const handleError = (hasError: boolean) => {
	if (hasError) {
		return notFound();
	}
};

export const getBuildDetail = async ({ id }: BuildDetailProps) => {
	const { data } = await getBuildDetailCached(id);
	handleError(!data);

	return { data };
};

export const getBuildLikeStatusForUser = async ({
	postUuid,
	userId,
}: {
	postUuid: string;
	userId?: string;
}) => {
	if (!userId) return false;

	const supabase = await createServerSupabaseAdminClient();
	const { data, error } = await supabase
		.from("likes")
		.select("id")
		.eq("post_id", postUuid)
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return Boolean(data);
};
