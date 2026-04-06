import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
	FRUIT_SKEWER_MAX_POINTS,
	FRUIT_SKEWER_OPTIONS,
	FRUIT_SKEWER_SPECIAL_KEY,
	getFruitSkewerLabel,
	getFruitSkewerValueOptions,
} from "@/src/features/add-build/config/fruitSkewer";
import {
	Button,
	Column,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Row,
	Typography,
} from "@/src/shared";

type FruitSkewerFormValue = {
	key: string;
	value: number;
};

const VALUE_STEPS = [-2, -1, 1, 2, 3];
const FRUIT_SKEWER_ICON_SIZE = 24;

const getFruitSkewerIconSrc = (key: string) =>
	key === FRUIT_SKEWER_SPECIAL_KEY ? "/combo/bonus.png" : `/combo/${key}.png`;

const getPreferredDefaultValue = (key: string) => {
	const values = getFruitSkewerValueOptions(key).map((option) => option.value);
	if (values.includes(1)) return 1;
	return values[0] ?? 1;
};

const getDefaultFruitSkewer = (
	selected: FruitSkewerFormValue[],
): FruitSkewerFormValue => {
	const nextKey =
		FRUIT_SKEWER_OPTIONS.find((option) =>
			selected.every((current) => current.key !== option.value),
		)?.value ?? FRUIT_SKEWER_OPTIONS[0].value;

	const defaultValue = getPreferredDefaultValue(nextKey);
	return { key: nextKey, value: defaultValue };
};

const getTotalPoints = (list: FruitSkewerFormValue[]) =>
	list.reduce((total, item) => total + Math.abs(item.value), 0);

export const SelectFruitSkewer = (form: any) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	return (
		<FormField
			control={form.control}
			name="fruit_skewer"
			render={({ field }) => {
				const selected = (field.value || []) as FruitSkewerFormValue[];
				const totalPoints = getTotalPoints(selected);
				const remainingPoints = FRUIT_SKEWER_MAX_POINTS - totalPoints;

				const updateAt = (index: number, value: FruitSkewerFormValue) => {
					const next = [...selected];
					next[index] = value;
					field.onChange(next);
				};

				const removeAt = (index: number) => {
					field.onChange(selected.filter((_, current) => current !== index));
				};

				const canApplyValue = (index: number, nextValue: number) => {
					const current = selected[index];
					if (!current) return false;
					const nextTotal =
						totalPoints - Math.abs(current.value) + Math.abs(nextValue);
					return nextTotal <= FRUIT_SKEWER_MAX_POINTS;
				};

				const openAddPicker = () => {
					setEditingIndex(null);
					setIsPickerOpen(true);
				};

				const openEditPicker = (index: number) => {
					setEditingIndex(index);
					setIsPickerOpen(true);
				};

				const isKeyDisabled = (key: string) =>
					selected.some((item, index) => {
						if (editingIndex !== null && index === editingIndex) return false;
						return item.key === key;
					});

				const applyPickedKey = (nextKey: string) => {
					if (editingIndex === null) {
						const next = getDefaultFruitSkewer(selected);
						const defaultValue =
							next.key === nextKey
								? next.value
								: getPreferredDefaultValue(nextKey);
						if (Math.abs(defaultValue) > remainingPoints) return;
						field.onChange([
							...selected,
							{ key: nextKey, value: defaultValue },
						]);
						setIsPickerOpen(false);
						return;
					}

					const current = selected[editingIndex];
					if (!current) return;

					const allowedValues = getFruitSkewerValueOptions(nextKey).map(
						(option) => option.value,
					);
					const nextValue = allowedValues.includes(current.value)
						? current.value
						: getPreferredDefaultValue(nextKey);

					if (!canApplyValue(editingIndex, nextValue)) return;
					updateAt(editingIndex, { key: nextKey, value: nextValue });
					setIsPickerOpen(false);
				};

				return (
					<FormItem className="w-full">
						<FormLabel className="flex-col md:flex-row text-nowrap">
							과일 꼬치{" "}
							<small className="opacity-50 text-wrap">
								콤보는 -2~+3, 적응형 드롭 보너스는 +1만 선택할 수 있어요.
							</small>
						</FormLabel>
						<FormControl>
							<Column className="w-full gap-3 rounded-2xl bg-gray-300/70 dark:bg-gray-800/70 p-3">
								<Row className="w-full flex-wrap items-start gap-3">
									{selected.map((entry, index) => {
										const valueIndex = VALUE_STEPS.indexOf(entry.value);
										const prevValue =
											valueIndex > -1 ? VALUE_STEPS[valueIndex - 1] : null;
										const nextValue =
											valueIndex > -1 ? VALUE_STEPS[valueIndex + 1] : null;
										const canDecrease =
											entry.key !== FRUIT_SKEWER_SPECIAL_KEY &&
											prevValue !== null &&
											canApplyValue(index, prevValue);
										const canIncrease =
											entry.key !== FRUIT_SKEWER_SPECIAL_KEY &&
											nextValue !== null &&
											canApplyValue(index, nextValue);

										return (
											<Column
												key={`${entry.key}-${index}`}
												className="relative w-[112px] h-max items-center justify-between gap-2"
											>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute -top-2 -right-2 z-10 size-6 rounded-full bg-background border"
													onClick={() => removeAt(index)}
												>
													<X className="size-3.5" />
												</Button>

												<Button
													type="button"
													variant="ghost"
													className="w-full h-full aspect-square rounded-xl bg-background border p-0 hover:bg-background/90"
													onClick={() => openEditPicker(index)}
												>
													<Image
														width={FRUIT_SKEWER_ICON_SIZE}
														height={FRUIT_SKEWER_ICON_SIZE}
														unoptimized
														src={getFruitSkewerIconSrc(entry.key)}
														alt={entry.key}
														className="object-contain"
													/>
												</Button>

												<Row className="gap-2 items-center">
													<Typography
														variant="caption"
														className="text-center leading-tight"
													>
														{getFruitSkewerLabel(entry.key)}
													</Typography>
													<Typography
														variant="caption"
														className={`text-center font-semibold ${
															entry.value > 0
																? "text-amber-400"
																: "text-cyan-300"
														}`}
													>
														{entry.value > 0 ? "+" : ""}
														{entry.value}
													</Typography>
												</Row>

												{entry.key === FRUIT_SKEWER_SPECIAL_KEY ? (
													<Row className="w-full justify-center rounded-lg bg-background border p-2">
														<Typography
															variant="caption"
															className="text-green-500"
														>
															적응형 활성화
														</Typography>
													</Row>
												) : (
													<Column className="w-full gap-1">
														<Row className="w-full items-center justify-between rounded-lg bg-background border p-0.5">
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className={`h-7 w-7 rounded-md border ${
																	canDecrease
																		? "border-cyan-300 text-cyan-300 hover:bg-cyan-500/10"
																		: "border-zinc-700 text-zinc-600"
																}`}
																onClick={() => {
																	if (!canDecrease || prevValue === null)
																		return;
																	updateAt(index, {
																		...entry,
																		value: prevValue,
																	});
																}}
																disabled={!canDecrease}
															>
																<Minus className="size-3.5" />
															</Button>
															<Typography
																variant="caption"
																className={`font-semibold ${
																	entry.value > 0
																		? "text-green-500"
																		: "text-red-500"
																}`}
															>
																{entry.value === -2
																	? "BAN"
																	: `${entry.value > 0 ? "+" : "-"}${Math.abs(entry.value) * 50}%`}
															</Typography>
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className={`h-7 w-7 rounded-md border ${
																	canIncrease
																		? "border-amber-300 text-amber-300 hover:bg-amber-500/10"
																		: "border-zinc-700 text-zinc-600"
																}`}
																onClick={() => {
																	if (!canIncrease || nextValue === null)
																		return;
																	updateAt(index, {
																		...entry,
																		value: nextValue,
																	});
																}}
																disabled={!canIncrease}
															>
																<Plus className="size-3.5" />
															</Button>
														</Row>
													</Column>
												)}
											</Column>
										);
									})}

									{remainingPoints > 0 && (
										<Button
											type="button"
											variant="ghost"
											className="w-[112px] min-w-[112px] h-[112px] rounded-xl border-2 border-dashed bg-background/50 hover:bg-background"
											onClick={openAddPicker}
										>
											<Plus className="size-7" />
										</Button>
									)}
								</Row>

								{selected.length === 0 && (
									<Row className="justify-center rounded-xl border border-dashed py-4 bg-background/40">
										<Typography
											variant="caption"
											className="text-muted-foreground"
										>
											+ 버튼으로 효과를 추가해 주세요.
										</Typography>
									</Row>
								)}

								<Typography variant="caption" className="text-muted-foreground">
									선택된 수치: {totalPoints}/{FRUIT_SKEWER_MAX_POINTS}
								</Typography>
							</Column>
						</FormControl>
						<FormMessage />

						<Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>효과 선택</DialogTitle>
									<DialogDescription>
										아이콘을 눌러 효과를 선택해 주세요.
									</DialogDescription>
								</DialogHeader>
								<Row className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-80 overflow-y-auto p-1">
									{FRUIT_SKEWER_OPTIONS.map((option) => {
										const disabled = isKeyDisabled(option.value);
										const isSpecial = option.value === FRUIT_SKEWER_SPECIAL_KEY;
										return (
											<Button
												key={option.value}
												type="button"
												variant="outline"
												className="h-auto py-2 px-1 flex-col gap-1"
												disabled={disabled}
												onClick={() => applyPickedKey(option.value)}
											>
												{isSpecial ? (
													<Image
														width={26}
														height={26}
														unoptimized
														src="/combo/bonus.png"
														alt={option.value}
													/>
												) : (
													<Image
														width={26}
														height={26}
														unoptimized
														src={`/combo/${option.value}.png`}
														alt={option.value}
													/>
												)}
												<Typography
													variant="caption"
													className="text-center leading-tight"
												>
													{option.label}
												</Typography>
											</Button>
										);
									})}
								</Row>
							</DialogContent>
						</Dialog>
					</FormItem>
				);
			}}
		/>
	);
};
