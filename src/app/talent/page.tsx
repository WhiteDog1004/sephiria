import type { Metadata } from "next";
import { TalentClientPage } from "@/src/modules/talent";
import { SITE_METADATA } from "@/src/shared/config/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.talent,
};

const TalentPage = async () => {
	return <TalentClientPage />;
};

export default TalentPage;
