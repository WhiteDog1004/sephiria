import { toast } from "sonner";
import type { CreateBuildLikeTypes } from "../model/createBuildLike.types";

export const createBuildLike = async ({
	postUuid,
	userId,
}: CreateBuildLikeTypes) => {
	const response = await fetch(`/api/builds/${postUuid}/like`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userId }),
	});
	const json = await response.json();

	if (!response.ok) {
		if (json?.code === "23505") {
			toast("이미 좋아요를 눌렀어요!", {
				position: "bottom-center",
				style: {
					backgroundColor: "#ff000080",
					color: "#ffffff",
				},
			});
			throw new Error("ALREADY_LIKED");
		}

		throw new Error(json?.message ?? "Failed to create like");
	}

	toast("좋아요 성공!", {
		position: "bottom-center",
		style: {
			backgroundColor: "#3e3e3ec5",
			color: "#ffffff",
		},
	});

	return { postUuid, userId };
};
