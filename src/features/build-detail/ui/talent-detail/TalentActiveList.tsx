import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "@/src/features/add-build";
import { ABILITY_TEXT_TYPES_COLORS } from "@/src/modules/builds";
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
					<AccordionContent className="flex justify-center gap-4 flex-wrap">
						{TALENT_ORDER.map((key) => {
							const value = talent[key];
							if (value <= 0) return null;

							const status = TALENT_STATUS[key];
							const name = TALENT_NAME[key];

							const activeStats = Object.entries(status.stat).filter(
								([point]) => value >= Number(point),
							);

							return (
								<Column key={key}>
									<Column className="max-w-60 gap-2">
										<Typography
											variant="body2"
											className={ABILITY_TEXT_TYPES_COLORS[key]}
										>
											{name} ({value}pt)
										</Typography>
										<Separator />
										<Column className="gap-2">
											{activeStats.map(([point, text]) => (
												<Typography variant="caption" key={point}>
													{point}: {text}
												</Typography>
											))}
										</Column>
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
