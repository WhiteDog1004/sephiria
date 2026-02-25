import { SITEMAP } from "@/src/shared/config/sitemap";

export const getWriterBuildSearchHref = (nickname: string) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		title: nickname,
		isWriter: "true",
	});

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};
