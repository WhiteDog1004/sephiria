import { NextResponse } from "next/server";

export function GET() {
	return new NextResponse(
		`
User-agent: *
Allow: /
Disallow: /fonts/

Sitemap: https://www.sephiria.wiki/sitemap.xml
  `.trim(),
		{
			headers: {
				"Content-Type": "text/plain",
			},
		},
	);
}
