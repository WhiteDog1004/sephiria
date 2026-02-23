import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuild } from "../api/createBuild";
import type { CreateBuildType } from "./createBuild.types";

export const useCreateBuild = () => {
	const queryClient = useQueryClient();

	return useMutation<CreateBuildType, unknown, CreateBuildType>({
		mutationFn: (req) => createBuild(req),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["builds", "list"] });
		},
	});
};
