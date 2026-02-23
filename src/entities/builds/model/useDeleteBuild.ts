import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBuild } from "../api/deleteBuild";

export const useDeleteBuild = () => {
	const queryClient = useQueryClient();

	return useMutation<string, unknown, string>({
		mutationFn: (req) => deleteBuild(req),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["builds", "list"] });
		},
	});
};
