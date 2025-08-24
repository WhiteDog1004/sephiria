"use client";

import { useState } from "react";
import { ArtifactList } from "@/src/features/artifact/ui/ArtifactList";
import { SearchItems } from "@/src/features/simulator/ui/SearchItems";
import { SectionHeader } from "@/src/shared/components/section-header";
import { Box } from "@/src/shared/ui/box";
import type { ArtifactProps } from "../model/types";

export const ArtifactLists = ({ data }: ArtifactProps) => {
	const [searchInput, setSearchInput] = useState("");
	const [selectedTier, setSelectedTier] = useState("all");
	const [selectedSets, setSelectedSets] = useState("all");

	const filteredItems = data.filter((item) => {
		const matchesSearch = item.label_kor
			.toLowerCase()
			.includes(searchInput.toLowerCase());
		const matchesTier = selectedTier === "all" || item.tier === selectedTier;
		const matchesSets =
			selectedSets === "all" || item.effect.sets?.includes(selectedSets);
		return matchesSearch && matchesTier && matchesSets;
	});

	return (
		<Box className="flex-col">
			<SectionHeader
				title={"아티팩트"}
				description={"원하는 아티팩트에 마우스를 올리면 효과를 볼 수 있어요!"}
			/>
			<Box className="justify-end px-0 py-4 w-full max-w-3xl">
				<SearchItems
					type={"artifact"}
					selectedTier={selectedTier}
					selectedSets={selectedSets}
					setSelectedSets={setSelectedSets}
					setSelectedTier={setSelectedTier}
					setSearchInput={setSearchInput}
				/>
			</Box>
			<ArtifactList data={filteredItems} />
		</Box>
	);
};
