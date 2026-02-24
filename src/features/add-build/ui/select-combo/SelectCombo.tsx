import { ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Badge,
	Button,
	Column,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Typography,
} from "@/src/shared";

const COMBO_OPTIONS = Object.entries(EFFECT_LABELS).map(([value, label]) => ({
	value,
	label,
}));
const MAX_COMBO_COUNT = 2;

export const SelectCombo = (form: any) => {
	const [openPopover, setOpenPopover] = useState(false);

	return (
		<FormField
			control={form.control}
			name="combo"
			render={({ field }) => {
				const selected = (field.value || []) as string[];

				const toggleCombo = (value: string) => {
					const exists = selected.includes(value);
					if (exists) {
						field.onChange(selected.filter((item) => item !== value));
						return;
					}
					if (selected.length >= MAX_COMBO_COUNT) return;
					field.onChange([...selected, value]);
				};

				return (
					<FormItem className="w-full">
						<FormLabel className="flex-col md:flex-row text-nowrap">
							핵심 콤보{" "}
							<small className="opacity-50 text-wrap">
								모험가분들이 쉽게 검색할 수 있도록 선택해 주세요!
							</small>
						</FormLabel>
						<FormControl>
							<Column className="w-full gap-2">
								<Popover open={openPopover} onOpenChange={setOpenPopover}>
									<PopoverTrigger asChild>
										<Row className="w-full min-h-10 border rounded-md px-3 py-2 bg-background cursor-pointer justify-between gap-2">
											<Row className="min-w-0 flex-1 items-center gap-2 flex-wrap max-h-20 overflow-y-auto">
												{selected.length > 0 ? (
													selected.map((value) => (
														<Badge
															key={value}
															variant="secondary"
															className="rounded-full gap-1.5"
														>
															<Image
																width={14}
																height={14}
																unoptimized
																src={`/combo/${value}.png`}
																alt={value}
															/>
															{EFFECT_LABELS[value] || value}
															<Row
																tabIndex={0}
																className="p-0 cursor-pointer"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	toggleCombo(value);
																}}
																onKeyDown={(e) => {
																	if (e.key === "Enter" || e.key === " ") {
																		e.preventDefault();
																		e.stopPropagation();
																		toggleCombo(value);
																	}
																}}
															>
																<X className="size-3" />
															</Row>
														</Badge>
													))
												) : (
													<Typography variant="body2" className="opacity-60">
														핵심 콤보 선택
													</Typography>
												)}
											</Row>
											<ChevronsUpDown className="opacity-60" />
										</Row>
									</PopoverTrigger>
									<PopoverContent className="w-[360px] max-w-[90vw] p-2">
										<Row className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
											{COMBO_OPTIONS.map((option) => {
												const checked = selected.includes(option.value);
												const disabled =
													!checked && selected.length >= MAX_COMBO_COUNT;

												return (
													<Button
														type="button"
														key={option.value}
														variant={checked ? "secondary" : "ghost"}
														disabled={disabled}
														className={`w-full h-10 px-2 justify-start ${
															checked
																? "border border-blue-500 bg-blue-500/15 text-blue-400 hover:bg-blue-500/20"
																: "border border-transparent"
														}`}
														onClick={() => toggleCombo(option.value)}
													>
														<Row className="items-center gap-1.5 w-full min-w-0 justify-center">
															<Image
																width={16}
																height={16}
																unoptimized
																src={`/combo/${option.value}.png`}
																alt={option.value}
															/>
															<Typography
																variant="caption"
																className="truncate"
															>
																{option.label}
															</Typography>
														</Row>
													</Button>
												);
											})}
										</Row>
									</PopoverContent>
								</Popover>
							</Column>
						</FormControl>
						<FormDescription className="text-center text-xs">
							최대 {MAX_COMBO_COUNT}개까지 선택할 수 있습니다.
						</FormDescription>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};
