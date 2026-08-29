import type { Metadata } from "next";
import { getArtifactLists } from "@/src/features/simulator/model/actions";
import SlabPuzzleGame from "@/src/modules/slab-puzzle/ui/SlabPuzzleGame";

export const metadata: Metadata = {
	title: "Sephiria - 서둘러라! 인벤토리 퍼즐",
	description:
		"아티팩트와 석판을 옮겨 목표 레벨을 완성하는 인벤토리 퍼즐 게임.",
	alternates: { canonical: "/slab-puzzle" },
};

const SlabPuzzlePage = async () => {
	const artifacts = await getArtifactLists();

	return <SlabPuzzleGame artifacts={artifacts} />;
};

export default SlabPuzzlePage;
