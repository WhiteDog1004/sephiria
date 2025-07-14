import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/src/shared/ui/input";
import { Row } from "@/src/shared/ui/row";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/shared/ui/select";
import { TIER_DATA } from "../config/constants";

interface SearchSlabsProps {
	searchInput: string;
	setSearchInput: Dispatch<SetStateAction<string>>;
	selectedTier: string;
	setSelectedTier: Dispatch<SetStateAction<string>>;
}

export const SearchSlabs = ({
	searchInput,
	setSearchInput,
	selectedTier,
	setSelectedTier,
}: SearchSlabsProps) => {
	return (
		<Row className="gap-4">
			<Select value={selectedTier} onValueChange={setSelectedTier}>
				<SelectTrigger className="w-[180px]">
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
			<Input
				type="text"
				placeholder="석판 검색..."
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				className="max-w-sm"
			/>
		</Row>
	);
};
