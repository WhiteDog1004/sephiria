import { useQuery } from "@tanstack/react-query";
import { getLoginInfo } from "@/src/shared/api";

export const useSession = () => {
	return useQuery({
		queryKey: ["user", "session"],
		queryFn: getLoginInfo,
		staleTime: 1000 * 60 * 5,
		retry: false,
	});
};
