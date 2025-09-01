import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { Column, Row, Tabs, Typography } from "@/src/shared";
import { WeaponContent } from "./WeaponContent";

interface WeaponTierListProps {
	tier: number;
	parent?: string;
	data: WeaponOptions[];
	onSelect: (value: string) => void;
}

export const WeaponTierList = ({
	tier,
	parent,
	data,
	onSelect,
}: WeaponTierListProps) => {
	const filtered = data.filter(
		(item) => item.tier === tier && item.parent === parent,
	);

	if (!filtered.length) return null;

	return (
		<Column className="flex-wrap gap-4">
			<Typography>tier {tier}</Typography>
			<Tabs>
				<Row className="flex-wrap gap-4">
					{filtered.map((list) => (
						<WeaponContent
							key={list.uuid}
							list={list}
							handler={() => onSelect(list.value)}
						/>
					))}
				</Row>
			</Tabs>
		</Column>
	);
};
