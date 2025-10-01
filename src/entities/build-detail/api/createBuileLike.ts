import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { CreateBuildLikeTypes } from "../model/createBuildLike.types";

const handleError = (error: PostgrestError | null) => {
	if (error) {
		throw error;
	}
};

export const createBuildLike = async ({
	postUuid,
	userId,
}: CreateBuildLikeTypes) => {
	const supabase = await createBrowserSupabaseClient();

	const { data, error } = await supabase
		.from("likes")
		.insert([{ post_id: postUuid, user_id: userId }]);

	if (error) {
		if (error.code === "23505") {
			toast("이미 좋아요를 눌렀어요!", {
				position: "bottom-center",
				style: {
					backgroundColor: "#ff000080",
					color: "#ffffff",
				},
			});
			throw new Error("ALREADY_LIKED");
		} else {
			handleError(error);
		}
		return null;
	}

	toast("좋아요 성공!", {
		position: "bottom-center",
		style: {
			backgroundColor: "#3e3e3ec5",
			color: "#ffffff",
		},
	});

	return data as any;
};
