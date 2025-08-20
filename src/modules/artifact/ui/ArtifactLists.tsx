"use client";

import { useState } from "react";
import { ArtifactList } from "@/src/features/artifact/ui/ArtifactList";
import { ArtifactTitle } from "@/src/features/artifact/ui/ArtifactTitle";
import { SearchItems } from "@/src/features/simulator/ui/SearchItems";
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
			<ArtifactTitle />
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
