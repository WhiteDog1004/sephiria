"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
	ARTIFACT_OPTION_FILTERS,
	matchesArtifactOptionFilter,
} from "@/src/entities/artifact/model/artifactOptionFilters";
import { ArtifactList } from "@/src/features/artifact/ui/ArtifactList";
import { SearchItems } from "@/src/features/simulator/ui/SearchItems";
import { AdSenseHorizontal } from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { Box } from "@/src/shared/ui/box";
import type { ArtifactProps } from "../model/types";

export const ArtifactLists = ({ data }: ArtifactProps) => {
	const [searchInput, setSearchInput] = useState("");
	const [selectedTier, setSelectedTier] = useState("all");
	const [selectedSets, setSelectedSets] = useState("all");
	const [selectedArtifactOptions, setSelectedArtifactOptions] = useState<
		string[]
	>([]);

	const handleArtifactOptionToggle = (value: string) => {
		setSelectedArtifactOptions((prev) =>
			prev.includes(value)
				? prev.filter((option) => option !== value)
				: [...prev, value],
		);
	};

	const deferredSearchInput = useDeferredValue(searchInput);
	const normalizedSearchInput = deferredSearchInput.trim().toLowerCase();
	const filteredItems = useMemo(
		() =>
			data.filter((item) => {
				const matchesSearch =
					!normalizedSearchInput ||
					item.label_kor.toLowerCase().includes(normalizedSearchInput) ||
					item.value.toLowerCase().includes(normalizedSearchInput);
				const matchesTier =
					selectedTier === "all" || item.tier === selectedTier;
				const matchesSets =
					selectedSets === "all" || item.effect.sets?.includes(selectedSets);
				const matchesOptions =
					selectedArtifactOptions.length === 0 ||
					selectedArtifactOptions.every((selectedOption) => {
						const optionFilter = ARTIFACT_OPTION_FILTERS.find(
							(option) => option.value === selectedOption,
						);
						if (!optionFilter) return false;
						return matchesArtifactOptionFilter(
							item.effect.content,
							optionFilter,
						);
					});

				return matchesSearch && matchesTier && matchesSets && matchesOptions;
			}),
		[
			normalizedSearchInput,
			data,
			selectedArtifactOptions,
			selectedSets,
			selectedTier,
		],
	);
	const isFiltering =
		normalizedSearchInput.length > 0 ||
		selectedTier !== "all" ||
		selectedSets !== "all" ||
		selectedArtifactOptions.length > 0;

	return (
		<Box className="flex-col">
			<SectionHeader
				title={"아티팩트"}
				description={
					"아티팩트를 클릭하면 상세 정보와 콤보 효과를 볼 수 있어요!"
				}
			/>
			<AdSenseHorizontal />
			<Box className="justify-end px-0 py-4 w-full max-w-3xl">
				<SearchItems
					type={"artifact"}
					selectedTier={selectedTier}
					selectedSets={selectedSets}
					setSelectedSets={setSelectedSets}
					setSelectedTier={setSelectedTier}
					setSearchInput={setSearchInput}
					artifactOptionFilters={ARTIFACT_OPTION_FILTERS}
					selectedArtifactOptions={selectedArtifactOptions}
					onArtifactOptionToggle={handleArtifactOptionToggle}
					onArtifactOptionReset={() => setSelectedArtifactOptions([])}
				/>
			</Box>
			<ArtifactList data={filteredItems} animateResults={isFiltering} />
		</Box>
	);
};
