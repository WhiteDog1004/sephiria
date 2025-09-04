import type { Metadata } from "next";
import { LargeLists } from "@/src/modules/large/ui/LargeLists";
import { SITE_METADATA } from "@/src/shared/lib/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.large,
};

const LargePage = () => {
	return <LargeLists />;
};

export default LargePage;
