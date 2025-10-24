import clsx from "clsx";
import Image from "next/image";
import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "@/src/features/add-build";
import {
	ABILITY_STATUS_ICONS,
	ABILITY_TEXT_COLORS,
} from "@/src/modules/builds";
import { Column, Row, Typography } from "@/src/shared";
import { TalentActiveList } from "./TalentActiveList";

export const TalentDetail = ({
	talent,
}: {
	talent: Record<TalentType, number>;
}) => {
	return (
		<Column className="w-full items-start md:items-center gap-2">
			<Typography>재능</Typography>
			<Row className="w-full overflow-x-auto">
				<Row className="min-w-max justify-center w-full gap-2">
					{Object.entries(TALENT_STATUS).map(([key, value], index) => {
						const talentKey = key as TalentType;
						const currentValue = talent[talentKey] ?? 0;

						return (
							<Column
								key={talentKey}
								className="w-full min-w-28 justify-between items-center gap-2 border rounded-lg p-2"
							>
								<Column className="items-center gap-2">
									<Typography>{TALENT_NAME[talentKey]}</Typography>

									<Typography className={ABILITY_TEXT_COLORS[index]}>
										{currentValue}
									</Typography>

									<Column className="gap-0.5">
										{value.level.label.map((label, i) => {
											const point = value.level.point[i];
											const total = currentValue * point;

											return (
												<Row
													key={i}
													className="gap-1 items-center justify-center"
												>
													<Typography
														variant="caption"
														className="text-green-600"
													>
														+{total}
													</Typography>
													<Typography variant="caption" className="text-nowrap">
														{label}
													</Typography>
													<Image
														width={16}
														height={16}
														className="min-w-4 max-w-4 object-contain"
														src={`/stat/${talentKey === "base" ? (i === 0 ? "hp" : "evasion") : ABILITY_STATUS_ICONS[index]}.png`}
														alt={key}
														unoptimized
													/>
												</Row>
											);
										})}
									</Column>
								</Column>

								<Column className="w-full">
									<Row className="w-full justify-center gap-2">
										{Object.entries(value.stat).map(([point], i) => (
											<Column key={i} className="items-center gap-2">
												<Typography variant="caption">{point}</Typography>
												<Image
													width={24}
													height={24}
													src={`/talent/${talentKey}_${point}.png`}
													alt="talent-image"
													className={`p-0 filter ${clsx(
														currentValue >= Number(point)
															? "grayscale-0 opacity-100"
															: "grayscale-75 opacity-50",
													)}`}
												/>
											</Column>
										))}
									</Row>
								</Column>
							</Column>
						);
					})}
				</Row>
			</Row>
			<Typography
				variant="caption"
				className="md:hidden w-full text-end text-gray-500"
			>
				가로로 드래그하여 확인하실 수 있어요!
			</Typography>

			<TalentActiveList talent={talent} />
		</Column>
	);
};
