import { getDetailList } from "@/src/features/costume/model/actions";
import { CostumeList } from "@/src/modules/costume/ui/CostumeList";
import { Box } from "@/src/shared/ui/box";

const CostumePage = async () => {
	const data = await getDetailList();
	return (
		<Box className="items-center">
			<CostumeList data={data ?? []} />
		</Box>
	);
};

export default CostumePage;
