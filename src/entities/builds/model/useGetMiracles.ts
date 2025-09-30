import { useQuery } from "@tanstack/react-query";
import { getClientMiracleDatas } from "../../miracle/api/getMiracleDatas";

export const useGetMiracles = () => {
	return useQuery({
		queryKey: ["miracles", "builds", "list"],
		queryFn: () => getClientMiracleDatas(),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
