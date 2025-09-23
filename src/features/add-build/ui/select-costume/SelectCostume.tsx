import clsx from "clsx";
import { useState } from "react";
import {
	Box,
	Button,
	COSTUMES,
	Column,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	ImageWithFallback,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Typography,
} from "@/src/shared";

export const SelectCostume = (form: any) => {
	const [openPopover, setOpenPopover] = useState(false);

	return (
		<FormField
			control={form.control}
			name="costume"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel className="justify-center">코스튬</FormLabel>
					<FormControl>
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
														src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${field.value}.png`}
														alt={field.value}
													/>
												}
											</Box>
											<Typography
												variant="body2"
												className="w-full max-w-full text-center truncate"
											>
												{COSTUMES[field.value].name}
											</Typography>
										</>
									) : (
										<>
											<Box className="p-2 h-40 border rounded-lg">?</Box>
											<Typography>코스튬</Typography>
										</>
									)}
								</Column>
							</PopoverTrigger>
							<PopoverContent>
								<Typography className="text-center mb-4">
									코스튬을 선택해 주세요
								</Typography>
								<Row className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
									{Object.keys(COSTUMES).map((costume) => (
										<Button
											className="flex-col h-max items-center justify-center gap-2 px-2"
											key={costume}
											onClick={() => {
												field.onChange(costume);
												setOpenPopover(false);
											}}
										>
											<ImageWithFallback
												className="min-w-10 max-w-10 min-h-10 max-h-10 object-contain p-0"
												width={40}
												height={40}
												src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${costume}.png`}
												alt={costume}
											/>
											<Typography
												variant="caption"
												className="text-[10px] w-full text-center truncate"
											>
												{COSTUMES[costume].name}
											</Typography>
										</Button>
									))}
								</Row>
							</PopoverContent>
						</Popover>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
