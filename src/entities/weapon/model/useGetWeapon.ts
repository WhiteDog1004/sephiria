import { useQuery } from "@tanstack/react-query";
import { getWeapon } from "../api/getWeapon";
import type { WeaponReq, WeaponRow } from "./types";

export const useGetWeapon = ({ weapon }: WeaponReq) => {
	return useQuery<WeaponRow>({
		queryKey: ["weapon", "list", weapon],
		queryFn: () => getWeapon({ weapon }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
