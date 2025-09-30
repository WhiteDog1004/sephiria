import { useQuery } from "@tanstack/react-query";
import { getCostume } from "../api/getCostume";
import type { CostumeReq, CostumeRow } from "./costume.types";

export const useGetCostume = ({ costume }: CostumeReq) => {
	return useQuery<CostumeRow>({
		queryKey: ["costume", "list", costume],
		queryFn: () => getCostume({ costume }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
