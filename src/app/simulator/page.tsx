import { getDetailList } from "@/src/features/costume/model/actions";
import Inventory from "@/src/modules/simulator/ui/Inventory";
import { Box } from "@/src/shared/ui/box";

const SimulatorPage = async () => {
	const data = await getDetailList();
	return (
		<Box className="items-center">
			<Inventory />
		</Box>
	);
};

export default SimulatorPage;
