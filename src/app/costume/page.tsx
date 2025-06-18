import { CostumeCarousel } from "@/src/entities/costume/ui/Carousel";
import { getDetailList } from "@/src/features/costume/model/actions";

const CostumePage = async () => {
	const data = await getDetailList();
	return <CostumeCarousel data={data ?? []} />;
};

export default CostumePage;
