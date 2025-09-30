import { useMutation } from "@tanstack/react-query";
import { deleteBuild } from "../api/deleteBuild";

export const useDeleteBuild = () => {
	return useMutation<string, unknown, string>({
		mutationFn: (req) => deleteBuild(req),
	});
};
