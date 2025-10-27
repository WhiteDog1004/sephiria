import Image from "next/image";
import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "@/src/features/add-build";
import {
	ABILITY_STATUS_ICONS,
	ABILITY_TEXT_COLORS,
	Box,
	Column,
	Row,
	Separator,
	Typography,
} from "@/src/shared";

export const TalentWrapper = () => {
	return (
		<Row className="w-full">
			<Column className="justify-center w-full gap-4 p-0">
				{Object.entries(TALENT_STATUS).map(([key, value], index) => {
					const talentKey = key as TalentType;
					return (
						<Box
							key={talentKey}
							className="flex-col md:flex-row w-full min-w-28 h-full items-center gap-2 border rounded-lg p-3 md:p-4"
						>
							<Column className="items-center gap-2">
								<Typography className={ABILITY_TEXT_COLORS[index]}>
									{TALENT_NAME[talentKey]}
								</Typography>

								<Column className="min-w-28 gap-0.5 items-center">
									{value.level.label.map((label, i) => {
										const point = value.level.point[i];

										return (
											<Column key={i} className="items-center">
												<Row
													key={i}
													className="gap-1 items-center justify-center"
												>
													<Typography
														variant="caption"
														className="text-green-600"
													>
														+{20 * point}
													</Typography>
													<Typography variant="caption">{label}</Typography>
													<Image
														width={16}
														height={16}
														className="min-w-4 max-w-4 object-contain"
														src={`/stat/${talentKey === "base" ? (i === 0 ? "hp" : "evasion") : ABILITY_STATUS_ICONS[index]}.png`}
														alt={key}
														unoptimized
													/>
												</Row>
												<Typography
													variant="caption"
													className="text-gray-300 dark:text-gray-600"
												>
													레벨당 +{point}
												</Typography>
											</Column>
										);
									})}
								</Column>
							</Column>

							<Column className="w-full justify-center gap-2">
								{Object.entries(value.stat).map(([point, text], i) => (
									<Column key={i}>
										{i === 0 && <Separator className="md:hidden mb-2" />}
										<Row className="items-center gap-2">
											<Row className="min-w-14 w-max items-center gap-2">
												<Image
													width={24}
													height={24}
													src={`/talent/${talentKey}_${point}.png`}
													alt="talent-image"
													className={`p-0 filter grayscale-0 opacity-100`}
												/>
												<Typography
													variant="caption"
													className="min-w-6 text-nowrap text-gray-600 dark:text-gray-400"
												>
													{point} :
												</Typography>
											</Row>
											<Typography className="w-full" variant="caption">
												{text}
											</Typography>
										</Row>
										{i !== 2 && <Separator className="mt-2" />}
									</Column>
								))}
							</Column>
						</Box>
					);
				})}
			</Column>
		</Row>
	);
};
