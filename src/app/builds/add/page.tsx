import type { Metadata } from "next";
import { AddBuildClientPage } from "@/src/modules/add-build";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = {
	...SITE_METADATA.builds,
};

const BuildsAddPage = async () => {
	return <AddBuildClientPage />;
};

export default BuildsAddPage;
