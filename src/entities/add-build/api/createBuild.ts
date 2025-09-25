import type { PostgrestError } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { CreateBuildType } from "../model/createBuild.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const createBuild = async (
	req: CreateBuildType,
): Promise<CreateBuildType> => {
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
	} = req;
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase.from("builds").insert({
		postUuid,
		youtube_link: youtube_link || null,
		title,
		description,
		content,
		costume,
		weapon,
		miracle,
		ability,
		version: "0.8.13",
		writer: {
			uuid: writer.uuid,
			nickname: writer.nickname,
			profileImage: writer.profileImage,
		},
	});

	handleError(error);

	return data as any;
};
