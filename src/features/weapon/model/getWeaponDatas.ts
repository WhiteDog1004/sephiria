import {
	getWeaponRows,
	type WeaponListOptions,
} from "@/src/entities/weapon/model/weaponCatalog";

export const getWeaponLists = async (options: WeaponListOptions = {}) => {
	return getWeaponRows(options);
};

export const getClientWeaponLists = async (options: WeaponListOptions = {}) => {
	return getWeaponLists(options);
};
