import type { Metadata } from "next";
import { Suspense } from "react";
import { BuildsClientPage } from "@/src/modules/builds";
import { SITE_METADATA } from "@/src/shared/config/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.builds,
};

export const revalidate = 3600;

const BuildsPage = async () => {
	return (
		<Suspense fallback={<></>}>
			<BuildsClientPage />
		</Suspense>
	);
};

export default BuildsPage;
