import debounce from "lodash.debounce";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { Input } from "@/src/shared/ui/input";
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
}

export const SearchItems = ({
	type,
	setSearchInput,
	selectedSets,
	setSelectedSets,
	selectedTier,
	setSelectedTier,
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
		<Row className="flex-col md:flex-row w-max items-center gap-2">
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
						{TIER_DATA.map((tier) => (
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
	);
};
