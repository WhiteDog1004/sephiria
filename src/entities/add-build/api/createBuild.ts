import type { CreateBuildType } from "../model/createBuild.types";

export const createBuild = async (
	req: CreateBuildType,
): Promise<CreateBuildType> => {
	const response = await fetch("/api/builds", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(req),
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to create build");
	}

	return req;
};
