import { getMiracleDatas } from "@/src/entities/miracle/api/getMiracleDatas";
import { MiracleLists } from "@/src/modules/miracle/ui/MiracleLists";

const MiraclePage = async () => {
	const data = await getMiracleDatas();

	return <MiracleLists data={data ?? []} />;
};

export default MiraclePage;
