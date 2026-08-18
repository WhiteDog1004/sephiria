import type { Metadata } from "next";
import { TermsClientPage } from "@/src/modules/terms";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = {
	...SITE_METADATA.terms,
};

const TermsPage = async () => {
	return <TermsClientPage />;
};

export default TermsPage;
