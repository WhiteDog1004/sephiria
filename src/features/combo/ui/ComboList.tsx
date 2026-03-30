import type { ComboItem } from "@/src/entities/combo/model/types";
import { Column, Row } from "@/src/shared";
import { ComboCard } from "./ComboCard";

export const ComboList = ({ data }: { data: ComboItem[] }) => {
	return (
		<Column className="w-full max-w-5xl px-4 pb-8">
			<Row className="grid w-full grid-cols-1 gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
				{data.map((combo) => (
					<ComboCard key={combo.key} combo={combo} />
				))}
			</Row>
		</Column>
	);
};
