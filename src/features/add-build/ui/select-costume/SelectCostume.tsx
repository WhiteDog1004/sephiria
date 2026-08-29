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
	FormMessage,
	ImageWithFallback,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";

export const SelectCostume = (form: any) => {
	const [openPopover, setOpenPopover] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState("");
	const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
	const costumeEntries = Object.entries(COSTUMES).filter(([costume, data]) => {
		if (!normalizedSearchKeyword) return true;

		return (
			costume.toLowerCase().includes(normalizedSearchKeyword) ||
			data.name.toLowerCase().includes(normalizedSearchKeyword)
		);
	});

	return (
		<FormField
			control={form.control}
			name="costume"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel className="justify-center">코스튬</FormLabel>
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
															src={getCloudflareUrl(
																`/costume/${field.value}.png`,
															)}
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
									<Input
										className="mb-3"
										value={searchKeyword}
										onChange={(event) => setSearchKeyword(event.target.value)}
										placeholder="코스튬 검색"
									/>
									<Row className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
										{costumeEntries.map(([costume]) => (
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
													src={getCloudflareUrl(`/costume/${costume}.png`)}
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
							<FormMessage />
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
