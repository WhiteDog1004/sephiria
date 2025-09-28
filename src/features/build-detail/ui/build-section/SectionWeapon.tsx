import clsx from "clsx";
import { useTheme } from "next-themes";
import { useGetWeapon, type WeaponReq } from "@/src/entities/weapon";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Column,
	ImageWithFallback,
	Separator,
	Typography,
} from "@/src/shared";
import { parseColoredString } from "@/src/shared/utils/parseColoredString";

export const SectionWeapon = ({ weapon }: WeaponReq) => {
	const { theme } = useTheme();
	const { data } = useGetWeapon({ weapon });

	if (!data) return;
	return (
		<Column className="w-full items-start md:items-center gap-2">
			<Typography>무기</Typography>
			<Column
				className={`md:max-w-lg w-full h-full gap-2 border-2 border-[#9092b3] rounded-lg p-4 ${clsx(theme === "dark" ? "bg-[#32313d]" : "bg-gray-100")}`}
			>
				<Column className="items-center">
					<ImageWithFallback
						className="w-16 h-16 object-contain p-0"
						width={64}
						height={64}
						src={data.image || "/"}
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
								무기 효과
							</Typography>
						</AccordionTrigger>
						<AccordionContent>
							<ul className="inline-flex flex-col gap-4 pl-4">
								{data.effects.reward?.map((reward) => (
									<li key={reward} className="marker:content-['-']">
										<Typography
											variant="body2"
											className="text-start whitespace-pre-line ml-2"
										>
											{parseColoredString(reward)}
										</Typography>
									</li>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</Column>
		</Column>
	);
};
