import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { getWeaponLists } from "@/src/features/weapon/model/getWeaponDatas";
import { WeaponList } from "@/src/modules/weapon/ui/WeaponList";
import { Box } from "@/src/shared/ui/box";

const WeaponPage = async () => {
	const data = await getWeaponLists();

	return (
		<Box className="items-center">
			<WeaponList data={data as WeaponOptions[]} />
		</Box>
	);
};

export default WeaponPage;
