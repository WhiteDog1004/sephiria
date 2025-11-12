import clsx from "clsx";
import { Fragment, useState } from "react";
import { useGetWeapons } from "@/src/entities/builds";
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
import { parseColoredString } from "@/src/shared/utils/parseColoredString";

export const SelectWeapon = (form: any) => {
	const [openPopover, setOpenPopover] = useState(false);
	const { data: weapons } = useGetWeapons();

	return (
		<FormField
			control={form.control}
			name="weapon"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel className="justify-center">무기</FormLabel>
					<FormControl>
						<Column className="w-full">
							<Popover open={openPopover} onOpenChange={setOpenPopover}>
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
															src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${field.value}.png`}
															alt={field.value}
														/>
													}
												</Box>
												<Typography
													variant="body2"
													className="w-full min-w-0 max-w-full text-center truncate"
												>
													{
														weapons?.find(
															(weapon) => weapon.value === field.value,
														).value_kor
													}
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
									<Row className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
										{weapons
											?.filter((weapon) => weapon.tier === 1)
											.map((tier1) => (
												<Fragment key={tier1.value}>
													<Row
														className="w-full h-8 col-span-3 justify-center my-2 items-center gap-2"
														key={tier1.value}
													>
														<Separator className="w-full max-w-8" />
														<ImageWithFallback
															className="min-w-6 max-w-6 p-0"
															width={32}
															height={32}
															src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${tier1.value}.png`}
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

													{weapons
														?.filter(
															(tier3) =>
																tier3.tier === 3 &&
																weapons.find(
																	(tier2) =>
																		tier2.tier === 2 &&
																		tier2.value === tier3.parent &&
																		tier2.parent === tier1.value,
																),
														)
														.map((tier3) => (
															<Button
																className="flex-col h-max items-center justify-center px-2 gap-2"
																key={tier3.value}
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
																			src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${tier3.value}.png`}
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
														))}
												</Fragment>
											))}
									</Row>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
