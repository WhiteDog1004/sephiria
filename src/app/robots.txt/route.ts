import { NextResponse } from "next/server";

export function GET() {
	return new NextResponse(
		`
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Naverbot
Allow: /

User-agent: SemrushBot
Disallow: /builds/

User-agent: AhrefsBot
Disallow: /builds/

User-agent: *
Allow: /
Disallow: /fonts/

Sitemap: https://sephiria.wiki/sitemap.xml
  `.trim(),
		{
			headers: {
				"Content-Type": "text/plain",
			},
		},
	);
}
