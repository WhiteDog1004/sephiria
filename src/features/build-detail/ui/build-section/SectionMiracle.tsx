import clsx from "clsx";
import { useTheme } from "next-themes";
import {
	highlightNumbers,
	type MiracleReq,
	useGetMiracle,
} from "@/src/entities/miracle";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Column,
	ImageWithFallback,
	Row,
	Separator,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

export const SectionMiracle = ({ miracle }: MiracleReq) => {
	const { theme } = useTheme();
	const { data } = useGetMiracle({ miracle });

	if (!data) return;
	return (
		<Column className="w-max h-max flex-1/3 items-start md:items-center gap-2">
			<Typography>기적</Typography>
			<Column
				className={`w-full h-full gap-2 border-2 border-[#9092b3] rounded-lg p-4 ${clsx(theme === "dark" ? "bg-[#32313d]" : "bg-gray-100")}`}
			>
				<Column className="items-center">
					<ImageWithFallback
						className="w-16 h-16 object-contain p-0"
						width={64}
						height={64}
						src={getCloudflareUrl(data.image || "/")}
						alt={data.value}
						unoptimized
					/>
					<Typography variant="body2">{data.value_kor}</Typography>
				</Column>
				<Separator />
				<Accordion type="single" collapsible>
					<AccordionItem value="effect">
						<AccordionTrigger className="items-center pt-2">
							<Typography className="text-secondary-foreground">
								기적 효과
							</Typography>
						</AccordionTrigger>
						<AccordionContent>
							<Column className="gap-2">
								{data.effects.reward?.map((reward) => (
									<Row key={reward} className="gap-1">
										{highlightNumbers(reward, false)}
									</Row>
								))}
								{data.effects.penalty?.map((penalty) => (
									<Row key={penalty} className="gap-1">
										{highlightNumbers(penalty, true)}
									</Row>
								))}
							</Column>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</Column>
		</Column>
	);
};
