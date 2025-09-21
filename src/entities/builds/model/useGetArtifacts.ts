import { useQuery } from "@tanstack/react-query";
import { getClientArtifactLists } from "@/src/features/simulator/model/actions";

export const useGetArtifacts = () => {
	return useQuery({
		queryKey: ["artifacts", "builds", "list"],
		queryFn: () => getClientArtifactLists(),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
