import type { Metadata } from "next";
import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { getWeaponLists } from "@/src/features/weapon/model/getWeaponDatas";
import { WeaponList } from "@/src/modules/weapon/ui/WeaponList";
import { SITE_METADATA } from "@/src/shared/config/sitemap";
import { Box } from "@/src/shared/ui/box";

export const metadata: Metadata = {
	...SITE_METADATA.weapon,
};

const WeaponPage = async () => {
	const data = await getWeaponLists();

	return (
		<Box className="items-center">
			<WeaponList data={data as WeaponOptions[]} />
		</Box>
	);
};

export default WeaponPage;
