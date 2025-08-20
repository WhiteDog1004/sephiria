import { getArtifactLists } from "@/src/features/simulator/model/actions";
import { ArtifactLists } from "@/src/modules/artifact/ui/ArtifactLists";

const ArtifactPage = async () => {
	const data = await getArtifactLists();

	return <ArtifactLists data={data || []} />;
};

export default ArtifactPage;
