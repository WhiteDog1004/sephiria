import type { GetBuildsParams, GetBuildsResponse } from "../model/builds.types";

export const getBuilds = async ({
	page = 1,
	limit = 10,
	isLatestVersion = false,
	like,
	isWriter,
	...req
}: GetBuildsParams): Promise<GetBuildsResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		like,
		isLatestVersion: String(isLatestVersion),
		isWriter: String(Boolean(isWriter)),
	});

	const { title, costume, weapon, miracle, combo } = req;
	if (title) params.set("title", title);
	if (costume) params.set("costume", costume);
	if (weapon) params.set("weapon", weapon);
	if (miracle) params.set("miracle", miracle);
	if (combo) params.set("combo", combo);

	const response = await fetch(`/api/builds?${params.toString()}`, {
		method: "GET",
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to fetch builds");
	}

	return json as GetBuildsResponse;
};
