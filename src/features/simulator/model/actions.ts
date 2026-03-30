import type { Database } from "@/types_db";
import artifactsJson from "@/src/entities/artifact/model/artifacts.json";

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

export const getArtifactLists = async () => {
	return getArtifactRows()
		.filter((artifact) => artifact.disabled !== true)
		.sort((a, b) => a.id - b.id);
};

export const getClientArtifactLists = async () => {
	return getArtifactLists();
};
