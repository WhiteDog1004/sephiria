import { getArtifactLists } from "@/src/features/simulator/model/actions";
import Inventory from "@/src/modules/simulator/ui/Inventory";
import { Box } from "@/src/shared/ui/box";

const SimulatorPage = async () => {
	const data = await getArtifactLists();

	return (
		<Box className="items-center">
			{data && <Inventory data={data || []} />}
		</Box>
	);
};

export default SimulatorPage;
