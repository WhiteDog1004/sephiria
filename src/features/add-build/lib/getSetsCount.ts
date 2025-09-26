import type { ArtifactInstance } from "@/src/entities/simulator/types";

export function getSetsCount(artifacts: ArtifactInstance["item"][]) {
	const setsCount: Record<string, number> = {};

	artifacts.forEach((artifact) => {
		artifact.effect.sets?.forEach((set) => {
			if (!setsCount[set]) {
				setsCount[set] = 1;
			} else {
				setsCount[set]++;
			}
		});
	});

	return setsCount;
}
