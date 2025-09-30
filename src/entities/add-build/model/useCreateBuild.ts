import { useMutation } from "@tanstack/react-query";
import { createBuild } from "../api/createBuild";
import type { CreateBuildType } from "./createBuild.types";

export const useCreateBuild = () => {
	return useMutation<CreateBuildType, unknown, CreateBuildType>({
		mutationFn: (req) => createBuild(req),
	});
};
