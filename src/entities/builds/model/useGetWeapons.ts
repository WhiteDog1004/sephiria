import { useQuery } from "@tanstack/react-query";
import type { WeaponListOptions } from "@/src/entities/weapon/model/weaponCatalog";
import { getClientWeaponLists } from "@/src/features/weapon/model/getWeaponDatas";

export const useGetWeapons = ({
	includeDisabled = false,
}: WeaponListOptions = {}) => {
	return useQuery({
		queryKey: ["weapons", "builds", "list", { includeDisabled }],
		queryFn: () => getClientWeaponLists({ includeDisabled }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
