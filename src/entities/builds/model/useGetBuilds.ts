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
		queryKey: [
			"builds",
			"list",
			page,
			like,
			isLatestVersion,
			JSON.stringify(req),
		],
		queryFn: () => getBuilds({ page, limit, isLatestVersion, like, ...req }),
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60,
	});
};
