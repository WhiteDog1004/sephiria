import { SITEMAP } from "@/src/shared/config/sitemap";

export const getComboBuildSearchHref = (combo: string) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		combo,
	});

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};

