import { useMutation } from "@tanstack/react-query";
import { updateBuild } from "../api/updateBuild";
import type { UpdateBuildType } from "./updateBuild.types";

export const useUpdateBuild = () => {
	return useMutation<UpdateBuildType, unknown, UpdateBuildType>({
		mutationFn: (req) => updateBuild(req),
	});
};
