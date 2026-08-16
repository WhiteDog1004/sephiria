import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getBuilds } from "../api/getBuilds";
import type { GetBuildsParams, GetBuildsResponse } from "./builds.types";

export const useGetBuilds = ({
	page,
	limit,
	isLatestVersion,
	like,
	isWriter,
	likedOnly,
	...req
}: GetBuildsParams): UseQueryResult<GetBuildsResponse> => {
	return useQuery({
		queryKey: [
			"builds",
			"list",
			page,
			like,
			isLatestVersion,
			isWriter,
			likedOnly,
			JSON.stringify(req),
		],
		queryFn: () =>
			getBuilds({
				page,
				limit,
				isLatestVersion,
				like,
				isWriter,
				likedOnly,
				...req,
			}),
		retry: 1,
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60,
	});
};
