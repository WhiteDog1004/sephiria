import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useGetMiracles } from "@/src/entities/builds";
import { highlightNumbers } from "@/src/entities/miracle";
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
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

const optionTransition = { duration: 0.18, ease: "easeOut" } as const;

export const SelectMiracle = (form: UseFormReturn<AddBuildFormType>) => {
	const { data: miracles } = useGetMiracles();
	const [openPopover, setOpenPopover] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const handleOpenChange = (open: boolean) => {
		setOpenPopover(open);
		setSearchKeyword("");
	};
	const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
	const filteredMiracles = miracles?.filter((miracle) => {
		if (!normalizedSearchKeyword) return true;

		return (
			miracle.value.toLowerCase().includes(normalizedSearchKeyword) ||
			miracle.value_kor.toLowerCase().includes(normalizedSearchKeyword)
		);
	});

	return (
		<FormField
			control={form.control}
			name="miracle"
			render={({ field }) => {
				const selectedMiracle = miracles?.find(
					(miracle) => miracle.value === field.value,
				);

				return (
					<FormItem className="w-full">
						<FormLabel className="justify-center">기적</FormLabel>
						<FormControl>
							<Column className="w-full">
								<Popover open={openPopover} onOpenChange={handleOpenChange}>
									<PopoverTrigger asChild>
										<Column
											className={`p-3 min-w-0 gap-2 bg-gray-200 dark:bg-gray-800 max-w-full h-40 border border-dashed rounded-lg justify-center items-center hover:border-blue-600 cursor-pointer ${clsx(field.value && "bg-transparent dark:bg-gray-900")}`}
										>
											{field.value ? (
												<>
													<Box className="p-2 h-full border rounded-lg">
														<ImageWithFallback
															className="min-w-10 max-w-10 min-h-10 max-h-10 object-contain p-0"
															width={40}
															height={40}
															src={getCloudflareUrl(
																selectedMiracle?.image || "",
															)}
															alt={field.value}
														/>
													</Box>
													<Typography
														variant="body2"
														className="w-full max-w-full text-center truncate"
													>
														{selectedMiracle?.value_kor}
													</Typography>
												</>
											) : (
												<>
													<Box className="p-2 h-40 border rounded-lg">?</Box>
													<Typography>기적</Typography>
												</>
											)}
										</Column>
									</PopoverTrigger>
									<PopoverContent>
										<Typography className="text-center mb-4">
											기적을 선택해 주세요
										</Typography>
										<Input
											className="mb-3"
											value={searchKeyword}
											onChange={(event) => setSearchKeyword(event.target.value)}
											placeholder="기적 검색"
										/>
										<Row className="relative grid grid-cols-3 gap-2 max-h-60 overflow-x-hidden overflow-y-auto">
											<AnimatePresence mode="popLayout">
												{filteredMiracles?.map((miracle) => (
													<motion.div
														key={miracle.value}
														layout
														initial={{ opacity: 0, scale: 0.96, y: 6 }}
														animate={{ opacity: 1, scale: 1, y: 0 }}
														exit={{ opacity: 0, scale: 0.92, y: -6 }}
														transition={optionTransition}
													>
														<Button
															className="flex-col h-max w-full items-center justify-center gap-2 px-2"
															onClick={() => {
																field.onChange(miracle.value);
																setOpenPopover(false);
															}}
														>
															<Tooltip key={miracle.value} delayDuration={400}>
																<TooltipTrigger asChild>
																	<ImageWithFallback
																		className="min-w-10 max-w-10 min-h-10 max-h-10 object-contain p-0"
																		width={40}
																		height={40}
																		src={getCloudflareUrl(miracle.image || "")}
																		alt={miracle.value}
																	/>
																</TooltipTrigger>
																<Typography
																	variant="caption"
																	className="text-[10px] w-full text-center truncate"
																>
																	{miracle.value_kor}
																</Typography>
																<TooltipContent sideOffset={16}>
																	<Column className="p-2 justify-center items-center text-center border-2 bg-secondary dark:bg-secondary/80">
																		{miracle.effects.reward?.map(
																			(reward: string) => (
																				<Row
																					key={reward}
																					className="gap-1 text-xs text-gray-900 dark:text-gray-300"
																				>
																					{highlightNumbers(reward, false)}
																				</Row>
																			),
																		)}
																	</Column>
																</TooltipContent>
															</Tooltip>
														</Button>
													</motion.div>
												))}
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
