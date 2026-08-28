import type { Metadata } from "next";
import { StatsClientPage } from "@/src/modules/stats";
import { SITE_METADATA } from "@/src/shared/config/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.stats,
};

const StatsPage = () => {
	return <StatsClientPage />;
};

export default StatsPage;
