import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getBuilds } from "../api/getBuilds";
import type { GetBuildsParams, GetBuildsResponse } from "./builds.types";

export const useGetBuilds = ({
	page,
	limit,
	isLatestVersion,
	like,
	...req
}: GetBuildsParams): UseQueryResult<GetBuildsResponse> => {
	return useQuery({
		queryKey: ["builds", "list", page, like, req],
		queryFn: () => getBuilds({ page, limit, isLatestVersion, like, ...req }),
	});
};
