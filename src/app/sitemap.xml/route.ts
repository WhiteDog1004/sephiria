// app/sitemap.xml/route.ts

import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const GET = async () => {
	const supabase = await createServerSupabaseClient();
	const { data: posts, error } = await supabase
		.from("builds")
		.select("postUuid, created_at");

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
		...posts.map((post: any) => ({
			loc: `${baseUrl}/builds/${post.postUuid}`,
			lastmod: post.created_at || new Date(),
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
			"Cache-Control": "s-maxage=3600, stale-while-revalidate",
		},
	});
};
