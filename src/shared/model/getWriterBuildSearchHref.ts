import { SITEMAP } from "@/src/shared/config/sitemap";

export const getWriterBuildSearchHref = (writerUuid: string) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		writerUuid,
	});

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};
