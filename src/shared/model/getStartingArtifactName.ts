const STARTING_ITEM_PATTERN = /^시작 아이템\s*:\s*(.+)$/;

export const getStartingArtifactName = (option: string) => {
	const artifactName = option.match(STARTING_ITEM_PATTERN)?.[1].trim();

	if (!artifactName || artifactName.includes("석판")) return undefined;

	return artifactName;
};
