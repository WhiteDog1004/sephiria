import type { Metadata } from "next";
import { PrivacyClientPage } from "@/src/modules/privacy";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = {
	...SITE_METADATA.privacy,
};

const PrivacyPage = async () => {
	return <PrivacyClientPage />;
};

export default PrivacyPage;
