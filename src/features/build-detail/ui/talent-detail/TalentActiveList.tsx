import Image from "next/image";
import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "@/src/features/add-build";
import {
	ABILITY_STATUS_ICONS,
	ABILITY_TEXT_TYPES_COLORS,
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Column,
	Row,
	Separator,
	Typography,
} from "@/src/shared";

const TALENT_ORDER: (keyof typeof TALENT_NAME)[] = [
	"anger",
	"rapid",
	"survival",
	"patience",
	"wisdom",
	"will",
	"base",
];

export const TalentActiveList = ({
	talent,
}: {
	talent: Record<TalentType, number>;
}) => {
	return (
		<Row className="w-full justify-center gap-2 border rounded-lg p-4">
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="effect" className="w-full">
					<AccordionTrigger className="w-full justify-center items-center">
						<Typography className="text-secondary-foreground">
							활성화된 재능 효과
						</Typography>
					</AccordionTrigger>
					<AccordionContent className="flex flex-wrap justify-center gap-4">
						{TALENT_ORDER.map((key, index) => {
							const value = talent[key] ?? 0;
							if (value <= 0) return null;

							const status = TALENT_STATUS[key];
							const name = TALENT_NAME[key];

							const activeStats = Object.entries(status.stat).filter(
								([point]) => value >= Number(point),
							);

							return (
								<Column
									key={key}
									className="max-w-60 gap-2 border rounded-lg p-4"
								>
									<Row className="gap-1 items-center flex-wrap">
										<Typography
											variant="body2"
											className={ABILITY_TEXT_TYPES_COLORS[key]}
										>
											{name}
										</Typography>

										<Typography variant="caption">(</Typography>
										<Column className="h-[34px] justify-center gap-0.5">
											{status.level.label.map((label, i) => {
												const point = status.level.point[i];
												const total = value * point;

												return (
													<Row key={i} className="gap-1 items-center">
														<Typography
															variant="caption"
															className="text-green-600"
														>
															+{total}
														</Typography>
														<Typography
															variant="caption"
															className="text-nowrap"
														>
															{label}
														</Typography>
														<Image
															width={16}
															height={16}
															className="min-w-4 max-w-4 object-contain"
															src={`/stat/${key === "base" ? (i === 0 ? "hp" : "evasion") : ABILITY_STATUS_ICONS[index]}.png`}
															alt={key}
															unoptimized
														/>
													</Row>
												);
											})}
										</Column>
										<Typography variant="caption">)</Typography>
									</Row>

									<Separator className="border-2 rounded-full" />

									<Column className="gap-2">
										{activeStats.map(([point, text], index) => (
											<Column key={point}>
												<Typography variant="caption">
													{point}: {text}
												</Typography>
												{activeStats.length - 1 !== index && (
													<Separator className="mt-2" />
												)}
											</Column>
										))}
									</Column>
								</Column>
							);
						})}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Row>
	);
};
