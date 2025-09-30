import { useMutation } from "@tanstack/react-query";
import { createBuildLike } from "../api/createBuileLike";
import type { CreateBuildLikeTypes } from "./createBuildLike.types";

export const useCreateBuildLike = () => {
	return useMutation<CreateBuildLikeTypes, unknown, CreateBuildLikeTypes>({
		mutationFn: (req) => createBuildLike(req),
	});
};
