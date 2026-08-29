import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useGetWeapons } from "@/src/entities/builds";
import type { AddBuildFormType } from "@/src/modules/add-build/model/formSchema";
import {
	Box,
	Button,
	Column,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	ImageWithFallback,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import { parseColoredString } from "@/src/shared/utils/parseColoredString";

const optionTransition = { duration: 0.18, ease: "easeOut" } as const;

export const SelectWeapon = (form: UseFormReturn<AddBuildFormType>) => {
	const [openPopover, setOpenPopover] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const handleOpenChange = (open: boolean) => {
		setOpenPopover(open);
		setSearchKeyword("");
	};
	const { data: weapons } = useGetWeapons();
	const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
	const matchesSearchKeyword = (value: string, label?: string | null) => {
		if (!normalizedSearchKeyword) return true;

		return (
			value.toLowerCase().includes(normalizedSearchKeyword) ||
			(label ?? "").toLowerCase().includes(normalizedSearchKeyword)
		);
	};

	return (
		<FormField
			control={form.control}
			name="weapon"
			render={({ field }) => {
				const selectedWeapon = weapons?.find(
					(weapon) => weapon.value === field.value,
				);

				return (
					<FormItem className="w-full">
						<FormLabel className="justify-center">무기</FormLabel>
						<FormControl>
							<Column className="w-full">
								<Popover open={openPopover} onOpenChange={handleOpenChange}>
									<PopoverTrigger asChild>
										<Column
											className={`p-3 min-w-0 gap-2 bg-gray-200 dark:bg-gray-800 max-w-full h-40 border border-dashed border- rounded-lg justify-center items-center hover:border-blue-600 cursor-pointer ${clsx(field.value && "bg-transparent dark:bg-gray-900")}`}
										>
											{field.value ? (
												<>
													<Box className="p-2 h-full border rounded-lg">
														{
															<ImageWithFallback
																className="min-w-10 max-w-10 min-h-10 max-h-10 object-contain p-0"
																width={40}
																height={40}
																src={getCloudflareUrl(
																	`/weapons/${field.value}.png`,
																)}
																alt={field.value}
															/>
														}
													</Box>
													<Typography
														variant="body2"
														className="w-full min-w-0 max-w-full text-center truncate"
													>
														{selectedWeapon?.value_kor}
													</Typography>
												</>
											) : (
												<>
													<Box className="p-2 h-40 border rounded-lg">?</Box>
													<Typography>무기</Typography>
												</>
											)}
										</Column>
									</PopoverTrigger>
									<PopoverContent>
										<Typography className="text-center mb-4">
											무기를 선택해 주세요
										</Typography>
										<Input
											className="mb-3"
											value={searchKeyword}
											onChange={(event) => setSearchKeyword(event.target.value)}
											placeholder="무기 검색"
										/>
										<Row className="relative grid grid-cols-3 gap-2 max-h-60 overflow-x-hidden overflow-y-auto">
											<AnimatePresence mode="popLayout">
												{weapons
													?.filter((weapon) => weapon.tier === 1)
													.map((tier1) => {
														const tier3Weapons = weapons.filter(
															(tier3) =>
																tier3.tier === 3 &&
																matchesSearchKeyword(
																	tier3.value,
																	tier3.value_kor,
																) &&
																weapons.find(
																	(tier2) =>
																		tier2.tier === 2 &&
																		tier2.value === tier3.parent &&
																		tier2.parent === tier1.value,
																),
														);

														if (tier3Weapons.length === 0) return null;

														return [
															<motion.div
																key={`group-${tier1.value}`}
																layout
																className="col-span-3"
																initial={{ opacity: 0, y: 6 }}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: -6 }}
																transition={optionTransition}
															>
																<Row className="w-full h-8 justify-center my-2 items-center gap-2">
																	<Separator className="w-full max-w-8" />
																	<ImageWithFallback
																		className="min-w-6 max-w-6 p-0"
																		width={32}
																		height={32}
																		src={getCloudflareUrl(
																			`/weapons/${tier1.value}.png`,
																		)}
																		alt={tier1.value}
																	/>

																	<Typography
																		className="whitespace-nowrap"
																		variant="body2"
																	>
																		{tier1.value_kor}
																	</Typography>
																	<Separator className="w-full max-w-8" />
																</Row>
															</motion.div>,

															...tier3Weapons.map((tier3) => (
																<motion.div
																	key={tier3.value}
																	layout
																	initial={{ opacity: 0, scale: 0.96, y: 6 }}
																	animate={{ opacity: 1, scale: 1, y: 0 }}
																	exit={{ opacity: 0, scale: 0.92, y: -6 }}
																	transition={optionTransition}
																>
																	<Button
																		className="flex-col h-max w-full items-center justify-center px-2 gap-2"
																		onClick={() => {
																			field.onChange(tier3.value);
																			setOpenPopover(false);
																		}}
																	>
																		<Tooltip delayDuration={400}>
																			<TooltipTrigger asChild>
																				<ImageWithFallback
																					className="min-w-10 w-10 max-w-10 min-h-10 h-10 max-h-10 object-contain p-0"
																					width={40}
																					height={40}
																					src={getCloudflareUrl(
																						`/weapons/${tier3.value}.png`,
																					)}
																					alt={tier3.value}
																				/>
																			</TooltipTrigger>
																			<Typography
																				variant="caption"
																				className="text-[10px] w-full text-center truncate"
																			>
																				{tier3.value_kor}
																			</Typography>

																			<TooltipContent sideOffset={16}>
																				<Column className="p-2 justify-center items-center text-center border-2 bg-secondary dark:bg-secondary/80">
																					{tier3.effects.reward?.map(
																						(reward: string) => (
																							<Typography
																								key={reward}
																								variant="body2"
																								className="max-w-64 text-gray-900 dark:text-gray-300 text-center whitespace-pre-line mt-2"
																							>
																								{parseColoredString(reward)}
																							</Typography>
																						),
																					)}
																				</Column>
																			</TooltipContent>
																		</Tooltip>
																	</Button>
																</motion.div>
															)),
														];
													})}
											</AnimatePresence>
										</Row>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</Column>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};
