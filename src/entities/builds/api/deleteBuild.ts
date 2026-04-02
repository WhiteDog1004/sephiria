export const deleteBuild = async (postUuid: string): Promise<string> => {
	const response = await fetch(`/api/builds/${postUuid}`, {
		method: "DELETE",
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to delete build");
	}

	return postUuid;
};
