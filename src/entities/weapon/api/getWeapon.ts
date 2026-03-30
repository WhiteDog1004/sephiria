import type { WeaponReq, WeaponRow } from "../model/types";
import weaponsJson from "../model/wepons.json";

type WeaponStaticRow = WeaponRow & { disabled?: boolean | null };

export const getWeapon = async ({ weapon }: WeaponReq): Promise<WeaponRow> => {
	const data = (weaponsJson as WeaponStaticRow[]).find(
		(item) => item.value === weapon && item.disabled !== true,
	);
	if (!data) {
		throw new Error("Weapon not found");
	}

	return data;
};
