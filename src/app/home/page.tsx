import { getDetailList } from "@/src/features/costume/model/actions";
import { ShortcutBox } from "@/src/features/home/ui/ShortcutBox";
import { Footer } from "@/src/modules/home/ui/Footer";
import { Box } from "@/src/shared/ui/box";

const Main = async () => {
	const data = await getDetailList();

	if (typeof window !== "undefined") return;
	return (
		<Box className="flex-col gap-8 p-0">
			<ShortcutBox data={data || []} />
			<Footer />
		</Box>
	);
};

export default Main;
