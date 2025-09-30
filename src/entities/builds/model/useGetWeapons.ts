import { useQuery } from "@tanstack/react-query";
import { getClientWeaponLists } from "@/src/features/weapon/model/getWeaponDatas";

export const useGetWeapons = () => {
	return useQuery({
		queryKey: ["weapons", "builds", "list"],
		queryFn: () => getClientWeaponLists(),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
