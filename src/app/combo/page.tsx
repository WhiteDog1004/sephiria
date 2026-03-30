import type { Metadata } from "next";
import { getComboLists } from "@/src/entities/combo/model/getComboLists";
import { ComboLists } from "@/src/modules/combo/ui/ComboLists";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = {
	...SITE_METADATA.combo,
};

const ComboPage = async () => {
	const data = await getComboLists();

	return <ComboLists data={data} />;
};

export default ComboPage;
