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

						return (
							<Column
								key={talentKey}
								className="w-full min-w-28 items-center gap-2 border rounded-lg p-2"
							>
								<Typography>{TALENT_NAME[talentKey]}</Typography>
								<Typography className={ABILITY_TEXT_COLORS[index]}>
									{talent[talentKey] ?? 0}
								</Typography>
								<Row className="gap-1">
									<Typography variant="caption" className="text-green-600">
										+{talent[talentKey] * TALENT_STATUS[talentKey].level.point}
									</Typography>
									<Row>
										<Typography variant="caption" className="text-nowrap">
											{value.level.label}
										</Typography>
										<Image
											width={16}
											height={16}
											className="min-w-4 max-w-4 object-contain"
											src={`/stat/${ABILITY_STATUS_ICONS[index]}.png`}
											alt={key}
											unoptimized
										/>
									</Row>
								</Row>
								<Column className="w-full">
									<Row className="w-full justify-center gap-2">
										{Object.entries(value.stat).map((status, index) => (
											<Column key={index} className="items-center gap-2">
												<Typography variant="caption">{status[0]}</Typography>
												<Image
													width={24}
													height={24}
													src={`/talent/${talentKey}_${status[0]}.png`}
													alt="talent-image"
													className={`p-0 filter ${clsx((talent[talentKey] ?? 0) >= Number(status[0]) ? "grayscale-0 opacity-100" : "grayscale-75 opacity-50")}`}
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
