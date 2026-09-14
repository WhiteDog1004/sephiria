import type { WeaponRow } from "./types";
import weaponsJson from "./weapons.json";

export type WeaponListOptions = { includeDisabled?: boolean };

const weapons = weaponsJson as WeaponRow[];

export const getWeaponRows = ({
	includeDisabled = false,
}: WeaponListOptions = {}) =>
	weapons
		.filter((weapon) => includeDisabled || weapon.disabled !== true)
		.sort((a, b) => a.id - b.id);

// Historical builds still belong to their original weapon family.
export const getRelatedWeaponValues = (weaponValue: string) => {
	const values = new Set([weaponValue]);
	const addChildren = (parentValue: string) => {
		for (const weapon of weapons) {
			if (weapon.parent === parentValue && !values.has(weapon.value)) {
				values.add(weapon.value);
				addChildren(weapon.value);
			}
		}
	};
	addChildren(weaponValue);
	return [...values];
};
