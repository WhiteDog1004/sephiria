import Image from "next/image";
import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "@/src/features/add-build";
import {
	ABILITY_STATUS_ICONS,
	ABILITY_TEXT_TYPES_COLORS,
} from "@/src/modules/builds";
import {
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
							const value = talent[key];
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
									<Row className="gap-1 items-center">
										<Typography
											variant="body2"
											className={ABILITY_TEXT_TYPES_COLORS[key]}
										>
											{name}
										</Typography>
										(
										<Typography variant="caption" className="text-green-600">
											+{talent[key] * TALENT_STATUS[key].level.point}
										</Typography>
										<Row>
											<Typography variant="caption" className="text-nowrap">
												{status.level.label}
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
										)
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
