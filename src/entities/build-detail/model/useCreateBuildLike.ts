import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createBuildLike,
	deleteBuildLike,
	getBuildLikeStatus,
} from "../api/createBuileLike";
import type {
	BuildLikeResponse,
	CreateBuildLikeTypes,
} from "./createBuildLike.types";

export const buildLikeQueryKey = ({ postUuid, userId }: CreateBuildLikeTypes) =>
	["build-like", postUuid, userId] as const;

export const useBuildLikeStatus = (
	req: CreateBuildLikeTypes,
	enabled: boolean,
	initialLiked?: boolean,
) => {
	return useQuery({
		queryKey: buildLikeQueryKey(req),
		queryFn: () => getBuildLikeStatus(req),
		enabled,
		initialData:
			initialLiked === undefined ? undefined : { liked: initialLiked },
		staleTime: initialLiked === undefined ? 0 : 1000 * 60 * 60,
	});
};

export const useCreateBuildLike = () => {
	return useMutation<BuildLikeResponse, unknown, CreateBuildLikeTypes>({
		mutationFn: (req) => createBuildLike(req),
	});
};

export const useDeleteBuildLike = () => {
	return useMutation<BuildLikeResponse, unknown, CreateBuildLikeTypes>({
		mutationFn: (req) => deleteBuildLike(req),
	});
};
