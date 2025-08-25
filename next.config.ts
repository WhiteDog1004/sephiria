import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.resolve.alias["@"] = path.resolve(__dirname, "."); // "." 기준, 즉 프로젝트 루트
		return config;
	},
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
