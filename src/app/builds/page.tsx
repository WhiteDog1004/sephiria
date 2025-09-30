import type { Metadata } from "next";
import { BuildsClientPage } from "@/src/modules/builds";
import { SITE_METADATA } from "@/src/shared/config/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.builds,
};

const BuildsPage = async () => {
	return <BuildsClientPage />;
};

export default BuildsPage;
