import type { ListType } from "@/src/entities/add-build/model/createBuild.types";

export const getArtifactValues = (content: ListType[]) => [
	...new Set(
		content
			.flatMap((group) => group.items.map((item) => item.value))
			.filter(Boolean),
	),
];
