import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createBuildLike,
	deleteBuildLike,
	getBuildLikeStatus,
} from "../api/createBuileLike";
import type { CreateBuildLikeTypes } from "./createBuildLike.types";

export const buildLikeQueryKey = ({ postUuid, userId }: CreateBuildLikeTypes) =>
	["build-like", postUuid, userId] as const;

export const useBuildLikeStatus = (
	req: CreateBuildLikeTypes,
	enabled: boolean,
) => {
	return useQuery({
		queryKey: buildLikeQueryKey(req),
		queryFn: () => getBuildLikeStatus(req),
		enabled,
	});
};

export const useCreateBuildLike = () => {
	return useMutation<CreateBuildLikeTypes, unknown, CreateBuildLikeTypes>({
		mutationFn: (req) => createBuildLike(req),
	});
};

export const useDeleteBuildLike = () => {
	return useMutation<CreateBuildLikeTypes, unknown, CreateBuildLikeTypes>({
		mutationFn: (req) => deleteBuildLike(req),
	});
};
