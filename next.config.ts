import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE}`,
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
};

export default nextConfig;
