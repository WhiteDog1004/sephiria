import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { SETS_EFFECT_COUNT_LABEL } from "@/src/features/add-build/config/getSetsEffect";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import FormattedEffectContent from "@/src/features/simulator/lib/formattedEffectContent";
import { getItemsTierColor } from "@/src/features/simulator/lib/getItemsTierColor";
import { renderStar } from "@/src/features/simulator/lib/renderStar";
import {
	Box,
	Column,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Row,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

const TIER_LABEL_MAP: Record<string, string> = {
	common: "일반",
	advanced: "고급",
	rare: "희귀",
	legend: "전설",
	solid: "결속",
};

const TIER_BADGE_STYLE_MAP: Record<string, string> = {
	common: "bg-slate-500 text-slate-100",
	advanced: "bg-blue-500/85 text-blue-50",
	rare: "bg-amber-400 text-slate-900",
	legend: "bg-pink-500/85 text-pink-50",
	solid:
		"bg-gradient-to-b from-yellow-400 via-lime-400 to-green-500 text-slate-900",
};

export const ArtifactDetailDialog = ({
	item,
}: {
	item: ArtifactInstance["item"];
}) => {
	const { theme } = useTheme();
	const setKeys = item.effect.sets ?? [];

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type="button"
					className="inline-flex w-19 h-24 p-1 flex-col cursor-pointer touch-manipulation"
				>
					<Box className="relative h-full p-0">
						<Image
							unoptimized
							fill
							src={getCloudflareUrl(item.image || "")}
							alt={item.label_kor}
						/>
					</Box>
					<Typography
						className={`py-1 whitespace-nowrap text-center overflow-hidden text-ellipsis ${clsx(getItemsTierColor(item.tier, theme === "light"))}`}
						variant="caption"
					>
						{item.label_kor}
					</Typography>
				</button>
			</DialogTrigger>

			<DialogContent
				showCloseButton
				className="w-[calc(100%-1rem)] max-w-4xl p-0 border-slate-700 bg-slate-900 text-slate-100"
			>
				<div className="max-h-[85vh] overflow-y-auto">
					<Column className="p-4 md:p-6 gap-6">
						<DialogTitle className="sr-only">{item.label_kor}</DialogTitle>
						<Row className="items-start gap-4 md:gap-6 flex-col md:flex-row">
							<Box className="relative p-0 w-24 h-24 md:w-32 md:h-32 rounded-xl border border-slate-700 bg-slate-800 shrink-0 overflow-hidden">
								<Image
									unoptimized
									fill
									src={getCloudflareUrl(item.image || "")}
									alt={item.label_kor}
								/>
							</Box>
							<Column className="items-start p-0 gap-2">
								<Row className="items-center gap-2 p-0 flex-wrap">
									{setKeys.map((set) => (
										<Row
											key={`${item.value}-${set}-chip`}
											className="items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-300/30"
										>
											<Image
												width={12}
												height={12}
												unoptimized
												src={`/combo/${set}.png`}
												alt={set}
											/>
											<Typography variant="caption">
												{EFFECT_LABELS[set] ?? set}
											</Typography>
										</Row>
									))}
									<Typography
										variant="caption"
										className="px-2 py-1 rounded-md bg-slate-700 text-amber-200"
									>
										{renderStar(item.level || 0)}
									</Typography>
								</Row>
								<Row className="items-center gap-2 p-0 flex-wrap">
									<Typography
										variant="header2"
										className={clsx(
											"font-bold",
											getItemsTierColor(item.tier, theme === "light"),
										)}
									>
										{item.label_kor}
									</Typography>
									<Typography
										variant="caption"
										className={clsx(
											"px-2 py-1 rounded-md font-semibold",
											TIER_BADGE_STYLE_MAP[item.tier] ??
												"bg-slate-500 text-slate-100",
										)}
									>
										{TIER_LABEL_MAP[item.tier] ?? item.tier}
									</Typography>
								</Row>
								<Typography
									className="text-slate-400 whitespace-pre-line"
									variant="caption"
								>
									{item.description || "설명이 아직 등록되지 않았습니다."}
								</Typography>
							</Column>
						</Row>

						<Column className="items-start p-0 gap-2">
							<Typography variant="body" className="font-semibold text-sky-300">
								아이템 효과
							</Typography>
							<Box className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800/70 justify-start">
								<FormattedEffectContent content={item.effect.content} />
							</Box>
						</Column>

						<Column className="items-start p-0 gap-2">
							<Typography variant="body" className="font-semibold text-sky-300">
								콤보 효과
							</Typography>
							{setKeys.length > 0 ? (
								<div className="grid w-full gap-3 grid-cols-1 md:grid-cols-2">
									{setKeys.map((set) => {
										const setEffects = SETS_EFFECT_COUNT_LABEL[set] || {};
										const levels = Object.keys(setEffects)
											.map(Number)
											.sort((a, b) => a - b);

										return (
											<Column
												key={`${item.value}-${set}`}
												className="items-start w-full p-4 gap-2 rounded-xl border border-slate-700 bg-slate-800/70"
											>
												<Row className="items-center gap-2 p-0">
													<Image
														width={20}
														height={20}
														unoptimized
														src={`/combo/${set}.png`}
														alt={set}
													/>
													<Typography variant="body2" className="font-semibold">
														{EFFECT_LABELS[set] ?? set}
													</Typography>
												</Row>
												{levels.length > 0 ? (
													levels.map((level) => (
														<Row
															key={`${set}-${level}`}
															className="items-start gap-2 p-0"
														>
															<Typography
																variant="caption"
																className="text-amber-300 min-w-4"
															>
																{level}
															</Typography>
															<Typography
																variant="caption"
																className="text-slate-300"
															>
																{setEffects[level]}
															</Typography>
														</Row>
													))
												) : (
													<Typography
														variant="caption"
														className="text-slate-400"
													>
														세트 효과 데이터가 없습니다.
													</Typography>
												)}
											</Column>
										);
									})}
								</div>
							) : (
								<Box className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800/70 justify-start">
									<Typography variant="body2" className="text-slate-400">
										연결된 콤보 세트가 없습니다.
									</Typography>
								</Box>
							)}
						</Column>
					</Column>
				</div>
			</DialogContent>
		</Dialog>
	);
};
