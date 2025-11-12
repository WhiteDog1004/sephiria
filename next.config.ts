import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}`,
				pathname: "/storage/v1/object/public/**",
			},
		],
		minimumCacheTTL: 60 * 60 * 24 * 365,
	},
};

export default nextConfig;
