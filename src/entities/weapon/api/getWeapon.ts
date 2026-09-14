import type { WeaponReq, WeaponRow } from "../model/types";
import { getWeaponRows } from "../model/weaponCatalog";

export const getWeapon = async ({ weapon }: WeaponReq): Promise<WeaponRow> => {
	const data = getWeaponRows({ includeDisabled: true }).find(
		(item) => item.value === weapon,
	);
	if (!data) {
		throw new Error("Weapon not found");
	}

	return data;
};
