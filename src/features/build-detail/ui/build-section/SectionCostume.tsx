import clsx from "clsx";
import { useTheme } from "next-themes";
import type { CostumeReq } from "@/src/entities/costume/model/costume.types";
import { useGetCostume } from "@/src/entities/costume/model/useGetCostume";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	COSTUMES,
	Column,
	ImageWithFallback,
	Separator,
	Typography,
} from "@/src/shared";
import { containsRedKeyword } from "@/src/shared/model/containsWords";
import { getCloudflareUrl } from "@/src/shared/utils/image";

export const SectionCostume = ({ costume }: CostumeReq) => {
	const { theme } = useTheme();
	const { data } = useGetCostume({ costume });

	if (!data) return;
	return (
		<Column className="w-max h-max flex-1/3 items-start md:items-center gap-2">
			<Typography>코스튬</Typography>
			<Column
				className={`max-w-sm w-full h-full gap-2 border-2 border-[#9092b3] rounded-lg p-4 ${clsx(theme === "dark" ? "bg-[#32313d]" : "bg-gray-100")}`}
			>
				<Column className="items-center">
					<ImageWithFallback
						className="w-16 h-16 object-contain p-0"
						width={64}
						height={64}
						src={getCloudflareUrl(data.image)}
						alt={data.value}
						unoptimized
					/>
					<Typography variant="body2">{COSTUMES[data.value].name}</Typography>
				</Column>
				<Separator />
				<Accordion type="single" collapsible>
					<AccordionItem value="effect">
						<AccordionTrigger className="items-center pt-2">
							<Typography className="text-secondary-foreground">
								코스튬 효과
							</Typography>
						</AccordionTrigger>
						<AccordionContent>
							<Column className="gap-2">
								{COSTUMES[data.value].options.map((option) => (
									<Typography
										key={option}
										variant="body2"
										className={`${
											containsRedKeyword(option)
												? "text-red-500"
												: "text-green-500"
										} w-full text-start`}
									>
										{option}
									</Typography>
								))}
							</Column>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</Column>
		</Column>
	);
};
