import type { Metadata } from "next";
import { getArtifactLists } from "@/src/features/simulator/model/actions";
import Inventory from "@/src/modules/simulator/ui/Inventory";
import { SITE_METADATA } from "@/src/shared/lib/sitemap";
import { Box } from "@/src/shared/ui/box";

export const metadata: Metadata = {
	...SITE_METADATA.simulator,
};

const SimulatorPage = async () => {
	const data = await getArtifactLists();

	return (
		<Box className="items-center p-2 md:p-8 w-max mx-auto">
			{data && <Inventory data={data || []} />}
		</Box>
	);
};

export default SimulatorPage;
