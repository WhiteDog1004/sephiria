// app/sitemap.xml/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 3600;

const DEFAULT_BUILD_SITEMAP_LIMIT = 200;

const getBuildSitemapLimit = () => {
	const rawLimit = Number(process.env.SITEMAP_BUILD_LIMIT ?? DEFAULT_BUILD_SITEMAP_LIMIT);
	if (!Number.isFinite(rawLimit) || rawLimit <= 0) return DEFAULT_BUILD_SITEMAP_LIMIT;
	return Math.floor(rawLimit);
};

export const GET = async () => {
	const buildSitemapLimit = getBuildSitemapLimit();
	const supabase = await createServerSupabaseClient();
	const { data: posts, error } = await supabase
		.from("builds")
		.select("postUuid, created_at, updated_at")
		.order("updated_at", { ascending: false, nullsFirst: false })
		.order("created_at", { ascending: false })
		.limit(buildSitemapLimit);

	if (error || !posts) {
		console.error("Supabase Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}

	const baseUrl = "https://sephiria.wiki";

	const urls = [
		{ loc: `${baseUrl}/`, lastmod: new Date() },
		{ loc: `${baseUrl}/simulator`, lastmod: new Date() },
		{ loc: `${baseUrl}/large`, lastmod: new Date() },
		{ loc: `${baseUrl}/artifact`, lastmod: new Date() },
		{ loc: `${baseUrl}/weapon`, lastmod: new Date() },
		{ loc: `${baseUrl}/miracle`, lastmod: new Date() },
		{ loc: `${baseUrl}/costume`, lastmod: new Date() },
		{ loc: `${baseUrl}/builds`, lastmod: new Date() },
		...posts.map((post: { postUuid: string; created_at: string; updated_at: string | null }) => ({
			loc: `${baseUrl}/builds/${post.postUuid}`,
			lastmod: post.updated_at || post.created_at || new Date(),
		})),
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date(url.lastmod).toISOString()}</lastmod>
  </url>`,
	)
	.join("")}
</urlset>`;

	return new NextResponse(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=UTF-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
};
