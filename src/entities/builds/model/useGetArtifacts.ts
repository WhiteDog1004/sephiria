import { useQuery } from "@tanstack/react-query";
import { getClientArtifactLists } from "@/src/features/simulator/model/actions";

export const useGetArtifacts = (
	{ includeDisabled = false }: { includeDisabled?: boolean } = {},
) => {
	return useQuery({
		queryKey: ["artifacts", "builds", "list", { includeDisabled }],
		queryFn: () => getClientArtifactLists({ includeDisabled }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
