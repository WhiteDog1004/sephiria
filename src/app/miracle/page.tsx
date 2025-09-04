import type { Metadata } from "next";
import { getMiracleDatas } from "@/src/entities/miracle/api/getMiracleDatas";
import { MiracleLists } from "@/src/modules/miracle/ui/MiracleLists";
import { SITE_METADATA } from "@/src/shared/lib/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.miracle,
};

const MiraclePage = async () => {
	const data = await getMiracleDatas();

	return <MiracleLists data={data ?? []} />;
};

export default MiraclePage;
