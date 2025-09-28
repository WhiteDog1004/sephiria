import { useQuery } from "@tanstack/react-query";
import { getMiracle } from "../api/getMiracleDatas";
import type { MiracleReq, MiracleRow } from "./types";

export const useGetMiracle = ({ miracle }: MiracleReq) => {
	return useQuery<MiracleRow>({
		queryKey: ["miracle", "list", miracle],
		queryFn: () => getMiracle({ miracle }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
