export const getCloudflareUrl = (url: string) => {
	if (!url) return "";

	if (url.startsWith("/wolfdog")) return url;

	let path = url;

	if (url.includes("supabase.co")) {
		const parts = url.split("/public/");
		if (parts.length > 1) {
			path = parts[1];
		}
	}

	path = path.replace(/\/+/g, "/");

	if (path.startsWith("/")) {
		path = path.slice(1);
	}

	return `/wolfdog/${path}`;
};
