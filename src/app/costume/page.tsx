import type { Metadata } from "next";
import { getDetailList } from "@/src/features/costume/model/actions";
import { getArtifactLists } from "@/src/features/simulator/model/actions";
import { CostumeList } from "@/src/modules/costume/ui/CostumeList";
import { COSTUMES } from "@/src/shared/config/costumes";
import { SITE_METADATA } from "@/src/shared/config/sitemap";
import { getStartingArtifactName } from "@/src/shared/model/getStartingArtifactName";
import { Box } from "@/src/shared/ui/box";

export const metadata: Metadata = {
	...SITE_METADATA.costume,
};

const CostumePage = async () => {
	const [data, artifacts] = await Promise.all([
		getDetailList(),
		getArtifactLists(),
	]);
	const startingArtifactNames = new Set(
		Object.values(COSTUMES)
			.flatMap((costume) => costume.options)
			.map(getStartingArtifactName)
			.filter((name): name is string => Boolean(name)),
	);
	const startingArtifacts = artifacts.filter((artifact) =>
		startingArtifactNames.has(artifact.label_kor),
	);

	return (
		<Box className="items-center">
			<CostumeList data={data ?? []} startingArtifacts={startingArtifacts} />
		</Box>
	);
};

export default CostumePage;
