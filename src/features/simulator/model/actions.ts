import artifactsJson from "@/src/entities/artifact/model/artifacts.json";
import type { Database } from "@/types_db";

type ArtifactRow = Database["public"]["Tables"]["artifacts"]["Row"];
type ArtifactStaticRow = Omit<ArtifactRow, "disabled"> & {
	disabled?: boolean | null;
};

const getArtifactRows = () => {
	return (artifactsJson as ArtifactStaticRow[]).map((artifact) => ({
		...artifact,
		disabled: artifact.disabled ?? undefined,
	}));
};

export const getArtifactLists = async (
	{ includeDisabled = false }: { includeDisabled?: boolean } = {},
) => {
	return getArtifactRows()
		.filter((artifact) => includeDisabled || artifact.disabled !== true)
		.sort((a, b) => a.id - b.id);
};

export const getClientArtifactLists = async (
	options: { includeDisabled?: boolean } = {},
) => {
	return getArtifactLists(options);
};
