import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";
import { highlightNumbers } from "@/src/entities/miracle/lib/highlightNumbers";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
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
import { getSetEffectText } from "../../config/getSetsEffect";

export const ItemsSets = ({
	form,
	index,
	artifacts,
}: {
	form: any;
	index: number;
	artifacts: ArtifactInstance["item"][];
}) => {
	const selectedValues = form.watch(`lists.${index}.items`);

	const setsMap = useMemo(() => {
		const map: Record<
			string,
			{ count: number; items: ArtifactInstance["item"][] }
		> = {};

		selectedValues.forEach((v: ArtifactInstance["item"]) => {
			const artifact = artifacts?.find((a) => a.value === v.value);
			if (!artifact) return;

			artifact.effect.sets?.forEach((set) => {
				const isUnique = artifact.effect.content?.includes("고유");

				if (!map[set]) {
					map[set] = { count: 1, items: [artifact] };
				} else {
					if (
						isUnique &&
						map[set].items.some((i) => i.value === artifact.value)
					) {
						return;
					}

					map[set].count++;
					map[set].items.push(artifact);
				}
			});
		});

		return map;
	}, [artifacts, selectedValues]);

	if (Object.keys(setsMap).length === 0) return null;
	return (
		<Column className="p-2 gap-2 bg-secondary/50 border rounded-lg">
			<Accordion defaultValue="combo" type="single" collapsible>
				<AccordionItem value="combo">
					<AccordionTrigger>
						<Typography className="text-secondary-foreground">
							콤보 효과
						</Typography>
					</AccordionTrigger>
					<AccordionContent>
						<Row className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full items-center gap-2">
							{Object.keys(setsMap)
								.sort((a, b) => setsMap[b].count - setsMap[a].count)
								.map((set, index) => (
									<Column
										className="w-full border rounded-md p-2 gap-1"
										key={set + index}
									>
										<Row className="items-center">
											<Image
												width={20}
												height={20}
												unoptimized
												src={`/combo/${set}.png`}
												alt={set}
											/>
											<Typography
												variant="body2"
												className={`w-24 sm:w-32 ${clsx(setsMap[set].count >= 2 ? "text-green-400" : "text-gray-500")}`}
											>
												{EFFECT_LABELS[set]} ({setsMap[set].count})
											</Typography>
										</Row>
										{setsMap[set].count >= 2 ? (
											<>
												<Separator />
												<Row className="gap-2">
													{highlightNumbers(
														getSetEffectText(
															set,
															setsMap[set].count > 6 ? 6 : setsMap[set].count,
														),
													)}
												</Row>
											</>
										) : (
											<>
												<Separator />
												<Typography
													variant="body2"
													className="text-gray-300 dark:text-gray-700"
												>
													{getSetEffectText(set, 2)}
												</Typography>
											</>
										)}
									</Column>
								))}
						</Row>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Column>
	);
};
