import { getDetailList } from "@/src/features/costume/model/actions";
import { Footer } from "@/src/modules/home/ui/Footer";
import { ShortcutList } from "@/src/modules/home/ui/ShortcutList";
import { Box } from "@/src/shared/ui/box";

const Main = async () => {
	const data = await getDetailList();
	return (
		<Box className="flex-col gap-8 p-0">
			<ShortcutList data={data || []} />
			<Footer />
		</Box>
	);
};

export default Main;
