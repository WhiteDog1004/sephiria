import type { WeaponRow } from "@/src/entities/weapon/model/types";
import weaponsJson from "@/src/entities/weapon/model/wepons.json";

type WeaponStaticRow = WeaponRow & { disabled?: boolean | null };

const getWeaponRows = () => {
	return weaponsJson as WeaponStaticRow[];
};

export const getWeaponLists = async () => {
	return getWeaponRows()
		.filter((weapon) => weapon.disabled !== true)
		.sort((a, b) => a.id - b.id);
};

export const getClientWeaponLists = async () => {
	return getWeaponLists();
};
