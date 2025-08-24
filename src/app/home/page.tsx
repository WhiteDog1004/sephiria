import { getDetailList } from "@/src/features/costume/model/actions";
import { ShortcutList } from "@/src/modules/home/ui/ShortcutList";
import { Box } from "@/src/shared/ui/box";

const Main = async () => {
	const data = await getDetailList();
	return (
		<Box className="flex-col gap-8 p-0">
			<ShortcutList data={data || []} />
		</Box>
	);
};

export default Main;
