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

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: *
Allow: /
Disallow: /builds/add
Disallow: /builds/modify/
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
