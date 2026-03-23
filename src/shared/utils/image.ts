export const getCloudflareUrl = (url: string) => {
	if (!url) return "";

	const assetBase = (
		process.env.NEXT_PUBLIC_ASSET_BASE_URL || "https://img.sephiria.wiki"
	).replace(/\/$/, "");
	const r2Folders = ["artifacts", "costume", "miracle", "slabs", "weapons"];

	// Already absolute URL and not a legacy Supabase URL: keep as-is.
	if (url.startsWith("http") && !url.includes("supabase.co")) {
		return url;
	}

	let path = url;

	if (url.includes("supabase.co")) {
		const parts = url.split("/public/");
		if (parts.length > 1) {
			path = parts[1];
		}
	}

	// Backward compatibility for legacy internal rewrite paths.
	if (path.startsWith("/wolfdog/")) {
		path = path.replace(/^\/wolfdog\//, "");
	}

	// If the value is like "/costume/a.png", treat it as an R2 object key.
	for (const folder of r2Folders) {
		if (path.startsWith(`/${folder}/`) || path.startsWith(`${folder}/`)) {
			path = path.replace(/\/+/g, "/").replace(/^\/+/, "");
			return `${assetBase}/${path}`;
		}
	}

	// Keep local static assets untouched (e.g. "/stat/x.png", "/combo/x.png").
	if (path.startsWith("/")) return path;

	path = path.replace(/\/+/g, "/");

	if (path.startsWith("/")) {
		path = path.slice(1);
	}

	return `${assetBase}/${path}`;
};
