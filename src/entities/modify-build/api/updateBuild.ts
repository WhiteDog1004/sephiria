import type { UpdateBuildType } from "../model/updateBuild.types";

export const updateBuild = async (
	req: UpdateBuildType,
): Promise<UpdateBuildType> => {
	const response = await fetch(`/api/builds/${req.postUuid}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req),
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to update build");
	}

	return req;
};

