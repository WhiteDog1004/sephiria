import Image from "next/image";
import {
	FRUIT_SKEWER_SPECIAL_KEY,
	getFruitSkewerChanceText,
	getFruitSkewerLabel,
} from "@/src/features/add-build/config/fruitSkewer";
import { Card, Row, Typography } from "@/src/shared";

type FruitSkewerItem = {
	key: string;
	value: number;
};

export const FruitSkewerDetail = ({
	fruitSkewer,
}: {
	fruitSkewer?: FruitSkewerItem[] | null;
}) => {
	if (!fruitSkewer || fruitSkewer.length === 0) return null;

	return (
		<Card className="w-full gap-3 p-4">
			<Row className="w-full gap-2 justify-center">
				<Image
					width={48}
					height={48}
					unoptimized
					src={`/fruit.png`}
					alt="fruit"
				/>
				<Typography>과일 꼬치</Typography>
			</Row>
			<Row className="w-full flex-wrap gap-x-6 gap-y-3 justify-center">
				{fruitSkewer.map((item, index) => (
					<Row key={`${item.key}-${index}`} className="items-center gap-2">
						{item.key === FRUIT_SKEWER_SPECIAL_KEY ? (
							<Image
								width={16}
								height={16}
								unoptimized
								src="/combo/bonus.png"
								alt={item.key}
							/>
						) : (
							<Image
								width={16}
								height={16}
								unoptimized
								src={`/combo/${item.key}.png`}
								alt={item.key}
							/>
						)}
						<Typography>{getFruitSkewerLabel(item.key)}</Typography>
						{item.key === FRUIT_SKEWER_SPECIAL_KEY ? (
							<Typography className="text-green-400">드롭 활성화</Typography>
						) : (
							<Typography
								className={item.value > 0 ? "text-green-400" : "text-red-500"}
							>
								{item.value > 0 ? "+" : ""}
								{item.value} (
								{item.value === -2
									? "BANNED"
									: getFruitSkewerChanceText(item.value)}
								)
							</Typography>
						)}
					</Row>
				))}
			</Row>
		</Card>
	);
};
