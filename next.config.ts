import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},

	async headers() {
		return [
			{
				source: "/wolfdog/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	async rewrites() {
		return [
			{
				source: "/wolfdog/:path*",
				destination: `https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/:path*`,
			},
		];
	},
};

export default nextConfig;
