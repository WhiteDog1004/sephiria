import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBuild } from "../api/updateBuild";
import type { UpdateBuildType } from "./updateBuild.types";

export const useUpdateBuild = () => {
	const queryClient = useQueryClient();

	return useMutation<UpdateBuildType, unknown, UpdateBuildType>({
		mutationFn: (req) => updateBuild(req),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["builds", "list"] });
		},
	});
};
