import { toast } from "sonner";
import type {
	BuildLikeResponse,
	CreateBuildLikeTypes,
} from "../model/createBuildLike.types";

export const getBuildLikeStatus = async ({
	postUuid,
	userId,
}: CreateBuildLikeTypes) => {
	const params = new URLSearchParams({ userId });
	const response = await fetch(`/api/builds/${postUuid}/like?${params}`);
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to get like");
	}

	return json as { liked: boolean };
};

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

	return json as BuildLikeResponse;
};

export const deleteBuildLike = async ({
	postUuid,
	userId,
}: CreateBuildLikeTypes) => {
	const response = await fetch(`/api/builds/${postUuid}/like`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userId }),
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to delete like");
	}

	toast("좋아요를 취소했어요.", {
		position: "bottom-center",
		style: {
			backgroundColor: "#3e3e3ec5",
			color: "#ffffff",
		},
	});

	return json as BuildLikeResponse;
};
