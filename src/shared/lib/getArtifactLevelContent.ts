export const getArtifactLevelContent = (
	content: string,
	level: number,
): string => {
	if (!content) {
		return "";
	}

	const dynamicPartRegex = /(\d+(\/\d+)*)/g;
	return content.replace(dynamicPartRegex, (match) => {
		const options = match.split("/").map(Number);
		const index = Math.max(0, Math.min(level - 1, options.length - 1));
		return options[index]?.toString() || match;
	});
};
