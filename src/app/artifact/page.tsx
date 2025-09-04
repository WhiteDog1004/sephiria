import type { Metadata } from "next";
import { getArtifactLists } from "@/src/features/simulator/model/actions";
import { ArtifactLists } from "@/src/modules/artifact/ui/ArtifactLists";
import { SITE_METADATA } from "@/src/shared/lib/sitemap";

export const metadata: Metadata = {
	...SITE_METADATA.artifact,
};

const ArtifactPage = async () => {
	const data = await getArtifactLists();

	return <ArtifactLists data={data || []} />;
};

export default ArtifactPage;
