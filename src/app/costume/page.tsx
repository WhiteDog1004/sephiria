import type { Metadata } from "next";
import { getDetailList } from "@/src/features/costume/model/actions";
import { CostumeList } from "@/src/modules/costume/ui/CostumeList";
import { SITE_METADATA } from "@/src/shared/config/sitemap";
import { Box } from "@/src/shared/ui/box";

export const metadata: Metadata = {
	...SITE_METADATA.costume,
};

const CostumePage = async () => {
	const data = await getDetailList();
	return (
		<Box className="items-center">
			<CostumeList data={data ?? []} />
		</Box>
	);
};

export default CostumePage;
