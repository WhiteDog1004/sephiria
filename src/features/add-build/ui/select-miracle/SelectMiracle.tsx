import clsx from "clsx";
import { useState } from "react";
import { useGetMiracles } from "@/src/entities/builds";
import { highlightNumbers } from "@/src/entities/miracle";
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
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";

export const SelectMiracle = (form: any) => {
	const { data: miracles } = useGetMiracles();
	const [openPopover, setOpenPopover] = useState(false);

	return (
		<FormField
			control={form.control}
			name="miracle"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel className="justify-center">기적</FormLabel>
					<FormControl>
						<Column className="w-full">
							<Popover open={openPopover} onOpenChange={setOpenPopover}>
								<PopoverTrigger asChild>
									<Column
										className={`p-3 min-w-0 gap-2 bg-gray-200 dark:bg-gray-800 max-w-full h-40 border border-dashed rounded-lg justify-center items-center hover:border-blue-600 cursor-pointer ${clsx(field.value && "bg-transparent dark:bg-gray-900")}`}
									>
										{field.value ? (
											<>
												<Box className="p-2 h-full border rounded-lg">
													{
														<ImageWithFallback
															className="min-w-10 max-w-10 min-h-10 max-h-10 object-contain p-0"
															width={40}
															height={40}
															src={
																miracles?.find(
																	(miracle) => miracle.value === field.value,
																).image
															}
															alt={field.value}
														/>
													}
												</Box>
												<Typography
													variant="body2"
													className="w-full max-w-full text-center truncate"
												>
													{
														miracles?.find(
															(miracle) => miracle.value === field.value,
														).value_kor
													}
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
									<Row className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
										{miracles?.map((miracle) => (
											<Button
												className="flex-col h-max items-center justify-center gap-2 px-2"
												key={miracle.value}
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
															src={miracle.image}
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
															{miracle.effects.reward?.map((reward: string) => (
																<Row
																	key={reward}
																	className="gap-1 text-xs text-gray-900 dark:text-gray-300"
																>
																	{highlightNumbers(reward, false)}
																</Row>
															))}
														</Column>
													</TooltipContent>
												</Tooltip>
											</Button>
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
