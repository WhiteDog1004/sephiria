import { useQuery } from "@tanstack/react-query";
import { getBuilds } from "../api/getBuilds";

export const useGetBuilds = ({ ...req }) => {
	return useQuery({
		queryKey: ["builds", "list", req],
		queryFn: () => getBuilds({ ...req }),
	});
};
