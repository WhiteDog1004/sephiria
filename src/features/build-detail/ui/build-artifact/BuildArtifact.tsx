import clsx from "clsx";
import Image from "next/image";
import { Fragment, useState } from "react";
import { useGetArtifacts } from "@/src/entities/builds";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { highlightNumbers } from "@/src/entities/miracle";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { SETS_EFFECT_COUNT_LABEL } from "@/src/features/add-build/config/getSetsEffect";
import { getSetEffectTiers } from "@/src/features/add-build/lib/getSetEffectTiers";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import { ArtifactTooltip } from "@/src/features/simulator/ui/ArtifactTooltip";
import {
	Box,
	Card,
	CardContent,
	Column,
	ImageWithFallback,
	Row,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";

export const BuildArtifact = ({
	artifacts,
}: {
	artifacts: BuildRow["content"];
}) => {
	const { data } = useGetArtifacts();
	const [isOpenTooltip, setIsOpenTooltip] = useState<string | undefined>(
		undefined,
	);
	const seenUniqueContents = new Set<string>();

	if (!data) return;
	const effectSets = artifacts?.flatMap((group) => {
		const sets = group.items.flatMap((artifact) => {
			const findItem = data.find((row) => row.value === artifact.value);
			if (!findItem) return [];

			const { sets, content } = findItem.effect;

			if (content.includes("[고유]")) {
				if (seenUniqueContents.has(content)) {
					return [];
				}
				seenUniqueContents.add(content);
			}

			return sets ?? [];
		});

		return sets.length > 0 ? sets : [];
	});

	const counts = effectSets.reduce<Record<string, number>>((acc, key) => {
		acc[key] = (acc[key] || 0) + 1;
		return acc;
	}, {});

	const effects = Object.entries(counts)
		.map(([set, count]) => {
			const { min } = getSetEffectTiers(set);
			if (!min) return null;

			const isActivated = count >= min;
			const setEffects = SETS_EFFECT_COUNT_LABEL[set];
			if (!setEffects) return null;

			const levels = Object.keys(setEffects)
				.map(Number)
				.sort((a, b) => a - b);

			const effectTexts = isActivated
				? levels
						.filter((level) => level <= count)
						.map((level) => ({ level, text: setEffects[level] }))
				: [{ level: min, text: setEffects[min] }];

			if (effectTexts.length === 0) return null;

			return { set, count, effectTexts, isActivated };
		})
		.filter(Boolean);

	return (
		<Column className="md:flex-row gap-2">
			<Column className="gap-4 flex-2/3">
				{artifacts.map((list, index) => (
					<Card key={list.label + index} className="p-6 gap-4">
						<Column>
							<Typography variant="header2">{list.label}</Typography>
						</Column>
						<Separator />
						<CardContent className="flex flex-col gap-4 px-0">
							<Column className="gap-1">
								<Typography variant="caption" className="opacity-60">
									아티팩트
								</Typography>
								<Row className="gap-2 flex-wrap">
									{list.items.map((item, idx) => {
										const findItem = data.find(
											(lists) => lists.value === item.value,
										);
										if (!findItem) return null;
										return (
											<Tooltip
												open={isOpenTooltip === item.value + index + idx}
												onOpenChange={(value) => {
													setIsOpenTooltip(
														value ? item.value + index + idx : undefined,
													);
												}}
												delayDuration={400}
												key={item.value + item.id + idx}
											>
												<TooltipTrigger asChild>
													<Box
														className="w-max p-2 border rounded-lg"
														onClick={() => {
															setIsOpenTooltip(item.value + index + idx);
														}}
													>
														<ImageWithFallback
															className="w-12 h-12 object-contain p-0"
															width={64}
															height={64}
															src={findItem.image || "/"}
															alt={findItem.value}
															unoptimized
														/>
														{item.img}
													</Box>
												</TooltipTrigger>
												<TooltipContent sideOffset={16}>
													<ArtifactTooltip
														data={findItem as ArtifactInstance["item"]}
													/>
												</TooltipContent>
											</Tooltip>
										);
									})}
								</Row>
							</Column>
							{list.description && (
								<Column className="gap-1">
									<Typography variant="caption" className="opacity-60">
										설명
									</Typography>
									<Row className="rounded-lg p-4 bg-secondary">
										<Typography variant="body2" className="whitespace-pre-line">
											{list.description}
										</Typography>
									</Row>
								</Column>
							)}
						</CardContent>
					</Card>
				))}
			</Column>
			<Column className="flex-1/5 border rounded-lg p-4 gap-2">
				<Typography variant="body2" className="opacity-60">
					콤보 효과
				</Typography>
				<Separator />

				<Row className="md:flex-col gap-2 flex-wrap">
					{effects
						.sort((a, b) => (b?.count || 0) - (a?.count || 0))
						.map((setInfo, index) => {
							if (!setInfo) return null;

							return (
								<Column
									key={setInfo.set + index}
									className={`border rounded-lg p-3 gap-1 ${clsx(!setInfo.isActivated && "text-gray-500 opacity-40")}`}
								>
									<Row className="items-center">
										<Image
											width={20}
											height={20}
											unoptimized
											src={`/combo/${setInfo.set}.png`}
											alt={setInfo.set}
										/>
										<Typography>
											{EFFECT_LABELS[setInfo.set]} ({setInfo.count})
										</Typography>
									</Row>

									{setInfo.effectTexts.map((effect, textIndex) => (
										<Fragment key={textIndex}>
											<Separator />
											<Row className="items-center gap-1">
												<Typography variant="caption">
													{effect.level}:
												</Typography>
												{setInfo.isActivated ? (
													highlightNumbers(effect.text)
												) : (
													<Typography variant="body2">{effect.text}</Typography>
												)}
											</Row>
										</Fragment>
									))}
								</Column>
							);
						})}
				</Row>
			</Column>
		</Column>
	);
};
