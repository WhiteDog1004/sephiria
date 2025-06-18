import { CostumeCarousel } from "@/src/entities/costume/ui/Carousel";
import { getDetailList } from "@/src/features/costume/model/actions";
import { Card } from "@/src/shared/ui/card";

export const MainCarousel = async () => {
	const data = await getDetailList();

	return (
		<Card className="w-full justify-center items-center p-16">
			<CostumeCarousel data={data ?? []} />
		</Card>
	);
};
