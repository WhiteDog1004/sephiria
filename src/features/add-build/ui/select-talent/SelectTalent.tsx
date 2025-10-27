import clsx from "clsx";
import { RotateCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	ABILITY_TEXT_COLORS,
	Button,
	Column,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Row,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import {
	TALENT_NAME,
	TALENT_STATUS,
	type TalentType,
} from "../../config/talentList";

export const SelectTalent = (form: any) => {
	const [count, setCount] = useState(40);

	useEffect(() => {
		const talentValues = form.getValues("talent");
		const total = Object.values(talentValues).reduce(
			(sum: number, val) => sum + Number(val),
			0,
		);
		setCount(40 - total);
	}, [form]);

	return (
		<FormField
			control={form.control}
			name="talent"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel className="justify-center">재능</FormLabel>
					<FormControl>
						<Column className="items-center gap-2 py-2 w-full border rounded-lg overflow-hidden">
							<Row className="gap-2 items-center">
								<Row className="gap-2">
									<Typography variant="body2">남은 포인트 :</Typography>
									<Typography
										variant="body2"
										className={clsx(count === 0 && "text-red-600")}
									>
										{count}
									</Typography>
								</Row>

								<Button
									type="button"
									size="sm"
									onClick={() => {
										form.reset({
											...form.getValues(),
											talent: {
												anger: 0,
												rapid: 0,
												survival: 0,
												patience: 0,
												wisdom: 0,
												will: 0,
												base: 0,
											},
										});
										setCount(40);
									}}
								>
									<RotateCw />
									리셋
								</Button>
							</Row>
							<Separator />
							<Row className="w-full overflow-x-auto">
								<Row className="min-w-max justify-evenly w-full px-3 gap-2">
									{Object.entries(TALENT_STATUS).map(([key, value], index) => {
										const talentKey = key as TalentType;

										return (
											<Column
												key={talentKey}
												className="w-28 justify-between items-center gap-2 border rounded-lg p-2"
											>
												<Column className="items-center gap-2">
													<Typography>{TALENT_NAME[talentKey]}</Typography>
													<Typography className={ABILITY_TEXT_COLORS[index]}>
														{field.value?.[talentKey] ?? 0}
													</Typography>
													<Column className="gap-1">
														{TALENT_STATUS[talentKey].level.label.map(
															(label, i) => {
																const point =
																	TALENT_STATUS[talentKey].level.point[i];
																const value = field.value?.[talentKey] ?? 0;
																const total = value * point;

																return (
																	<Row
																		key={i}
																		className="gap-1 justify-center items-center"
																	>
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
																	</Row>
																);
															},
														)}
													</Column>
												</Column>
												<Column className="w-full">
													<Row className="w-full justify-evenly gap-2">
														{Object.entries(value.stat).map((status, index) => (
															<Column
																key={index}
																className="items-center gap-2 cursor-pointer"
																onClick={() => {
																	const clickedValue = Number(status[0]);
																	const currentTalent =
																		(form.getValues("talent") as Record<
																			TalentType,
																			number
																		>) || {};
																	const prevValue =
																		currentTalent[talentKey] || 0;

																	const newValue =
																		prevValue === clickedValue
																			? 0
																			: clickedValue;

																	const usedPointsAfter =
																		Object.values(currentTalent).reduce(
																			(acc, val) => acc + (val || 0),
																			0,
																		) -
																		prevValue +
																		newValue;

																	if (usedPointsAfter > 40) return;

																	const updatedTalent = {
																		...currentTalent,
																		[talentKey]: newValue,
																	};
																	form.setValue("talent", updatedTalent, {
																		shouldValidate: true,
																		shouldDirty: true,
																	});

																	setCount(40 - usedPointsAfter);
																}}
															>
																<Typography variant="caption">
																	{status[0]}
																</Typography>
																<Tooltip delayDuration={400}>
																	<TooltipTrigger asChild>
																		<Image
																			width={24}
																			height={24}
																			src={`/talent/${talentKey}_${status[0]}.png`}
																			alt="talent-image"
																			className={`p-0 filter ${clsx((field.value?.[talentKey] ?? 0) >= status[0] ? "grayscale-0 opacity-100" : "grayscale-75 opacity-50")}`}
																		/>
																	</TooltipTrigger>
																	<TooltipContent sideOffset={16}>
																		<Row className="p-2 max-w-40 justify-center items-center text-center">
																			<Typography variant="caption">
																				{
																					TALENT_STATUS[talentKey].stat[
																						Number(status[0])
																					]
																				}
																			</Typography>
																		</Row>
																	</TooltipContent>
																</Tooltip>
															</Column>
														))}
													</Row>
												</Column>
											</Column>
										);
									})}
								</Row>
							</Row>
							<FormMessage />
							<Typography variant="caption" className="text-gray-600">
								해당 아이콘을 눌러 활성화해 주세요!
							</Typography>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
