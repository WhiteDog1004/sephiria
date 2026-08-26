import debounce from "lodash.debounce";
import { SlidersHorizontal } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { ArtifactOptionFilter } from "@/src/entities/artifact/model/artifactOptionFilters";
import { Button } from "@/src/shared/ui/button";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/shared/ui/popover";
import { Row } from "@/src/shared/ui/row";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/shared/ui/select";
import { EFFECT_LABELS, TIER_DATA } from "../config/constants";

interface SearchItemsProps {
	type: "slabs" | "artifact";
	setSearchInput: Dispatch<SetStateAction<string>>;
	selectedTier: string;
	setSelectedTier: Dispatch<SetStateAction<string>>;
	selectedSets?: string;
	setSelectedSets?: Dispatch<SetStateAction<string>>;
	artifactOptionFilters?: ArtifactOptionFilter[];
	selectedArtifactOptions?: string[];
	onArtifactOptionToggle?: (value: string) => void;
	onArtifactOptionReset?: () => void;
}

export const SearchItems = ({
	type,
	setSearchInput,
	selectedSets,
	setSelectedSets,
	selectedTier,
	setSelectedTier,
	artifactOptionFilters,
	selectedArtifactOptions = [],
	onArtifactOptionToggle,
	onArtifactOptionReset,
}: SearchItemsProps) => {
	const [currentValue, setCurrentValue] = useState("");
	const handleSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearchInput(value);
			}, 200),
		[setSearchInput],
	);

	const EFFECT_DATA = [
		{ value: "all", label: "콤보 전체" },
		...Object.entries(EFFECT_LABELS).map(([value, label]) => ({
			value,
			label,
		})),
	];

	return (
		<Row className="flex-col w-full items-end gap-2">
			<Row className="flex-col md:flex-row w-full md:w-max items-center justify-end gap-2">
				<Row className="w-max gap-2 p-0">
					{type !== "slabs" && (
						<Select value={selectedSets} onValueChange={setSelectedSets}>
							<SelectTrigger className="w-[112px]">
								<SelectValue placeholder="콤보 선택" />
							</SelectTrigger>
							<SelectContent>
								{EFFECT_DATA.map((sets) => (
									<SelectItem key={sets.value} value={sets.value}>
										{sets.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Select value={selectedTier} onValueChange={setSelectedTier}>
						<SelectTrigger className="w-[112px]">
							<SelectValue placeholder="등급 선택" />
						</SelectTrigger>
						<SelectContent>
							{TIER_DATA.filter((item) =>
								type === "slabs" ? item.value !== "solid" : item,
							).map((tier) => (
								<SelectItem key={tier.value} value={tier.value}>
									{tier.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Row>
				<Input
					type="text"
					placeholder={`${type === "slabs" ? "석판" : "아티팩트"} 검색...`}
					value={currentValue}
					onChange={(e) => {
						setCurrentValue(e.target.value);
						handleSearch(e.target.value);
					}}
					className="max-w-sm"
				/>
			</Row>
			{type === "artifact" &&
				artifactOptionFilters &&
				onArtifactOptionToggle &&
				onArtifactOptionReset && (
					<Popover>
						<PopoverTrigger asChild>
							<Button size="sm" className="w-max">
								<SlidersHorizontal />
								옵션
								{selectedArtifactOptions.length > 0 &&
									` ${selectedArtifactOptions.length}`}
							</Button>
						</PopoverTrigger>
						<PopoverContent align="end" className="w-[320px]">
							<div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
								<Row className="justify-end p-0">
									<Button
										size="sm"
										onClick={onArtifactOptionReset}
										disabled={selectedArtifactOptions.length === 0}
									>
										초기화
									</Button>
								</Row>
								<div className="grid grid-cols-2 gap-2">
									{artifactOptionFilters.map((option) => (
										<Label
											key={option.value}
											className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2 text-xs font-medium shadow-xs transition-colors hover:bg-accent"
										>
											<Checkbox
												checked={selectedArtifactOptions.includes(option.value)}
												onCheckedChange={() =>
													onArtifactOptionToggle(option.value)
												}
											/>
											{option.label}
										</Label>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>
				)}
		</Row>
	);
};
