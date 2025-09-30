import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { UpdateBuildType } from "../model/updateBuild.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const updateBuild = async (
	req: UpdateBuildType,
): Promise<UpdateBuildType> => {
	const {
		postUuid,
		title,
		description,
		costume,
		weapon,
		miracle,
		content,
		youtube_link,
		writer,
		ability,
		version,
	} = req;
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("builds")
		.update({
			postUuid,
			youtube_link: youtube_link || null,
			title,
			description,
			content,
			costume,
			weapon,
			miracle,
			ability,
			version,
			updated_at: new Date().toISOString(),
			writer: {
				uuid: writer.uuid,
				nickname: writer.nickname,
				profileImage: writer.profileImage,
			},
		})
		.eq("postUuid", postUuid)
		.select();

	handleError(error);

	return data as any;
};
