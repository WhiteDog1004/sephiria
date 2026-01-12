export const getCloudflareUrl = (url: string) => {
	if (!url) return "";

	if (url.startsWith("/wolfdog")) return url;

	if (url.includes("supabase.co")) {
		const parts = url.split("/public/");
		if (parts.length > 1) {
			return `/wolfdog/${parts[1]}`;
		}
	}

	return `/wolfdog/${url}`;
};
