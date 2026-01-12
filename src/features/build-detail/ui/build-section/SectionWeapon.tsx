import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { SubWeaponBox } from "@/src/entities/build-detail";
import { useGetWeapons } from "@/src/entities/builds";
import { useGetWeapon, type WeaponReq } from "@/src/entities/weapon";
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
import { parseColoredString } from "@/src/shared/utils/parseColoredString";

export const SectionWeapon = ({ weapon }: WeaponReq) => {
	const { theme } = useTheme();
	const { data: weapons } = useGetWeapons();
	const { data } = useGetWeapon({ weapon });

	const tier2Weapon = weapons?.find((item) => data?.parent === item.value);
	const filteredWeapon = weapons
		?.filter((item) => item.tier === 1)
		.find((item) => item.value === tier2Weapon?.parent);

	if (!data || !filteredWeapon) return;
	return (
		<Column className="w-full items-start md:items-center gap-2">
			<Typography>무기</Typography>
			<Column
				className={`md:max-w-lg w-full h-full gap-2 border-2 border-[#9092b3] rounded-lg p-4 ${clsx(theme === "dark" ? "bg-[#32313d]" : "bg-gray-100")}`}
			>
				<Column className="items-center">
					<Row className="relative items-center gap-1">
						<Row className="absolute items-center -left-24">
							<SubWeaponBox weapon={filteredWeapon} />
							<ArrowRight className="size-4 opacity-50" />
							<SubWeaponBox weapon={tier2Weapon} />
							<ArrowRight className="size-4 opacity-50" />
						</Row>
						<ImageWithFallback
							className="w-16 h-16 object-contain p-0"
							width={64}
							height={64}
							src={getCloudflareUrl(data.image || "/")}
							alt={data.value}
							unoptimized
						/>
					</Row>
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
