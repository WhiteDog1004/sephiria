import clsx from "clsx";
import debounce from "lodash.debounce";
import { CopyPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	getRarityValue,
	type Rarity,
} from "@/src/features/simulator/lib/getRarityOrder";
import { ArtifactTooltip } from "@/src/features/simulator/ui/ArtifactTooltip";
import {
	Button,
	Column,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	ImageWithFallback,
	Input,
	Row,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { getTierBorderColor } from "../../config/getTierBorderColor";

export const ItemsAddItems = ({
	artifacts,
	form,
	index,
}: {
	artifacts: ArtifactInstance["item"][];
	form: UseFormReturn;
	index: number;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentValue, setCurrentValue] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [selectedSets, setSelectedSets] = useState("all");
	const [selectIndex, setSelectIndex] = useState(0);

	const fieldValue = form.getValues(`lists.${index}.items`) || "";

	const { append, update, remove } = useFieldArray({
		control: form.control,
		name: `lists.${index}.items`,
	});

	const EFFECT_DATA = [
		{ value: "all", label: "콤보 전체" },
		...Object.entries(EFFECT_LABELS).map(([value, label]) => ({
			value,
			label,
		})),
	];

	const handleSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearchInput(value);
			}, 200),
		[],
	);

	const filteredItems = artifacts
		?.sort(
			(a, b) =>
				getRarityValue(a.tier as Rarity) - getRarityValue(b.tier as Rarity),
		)
		.filter((item) => {
			const matchesSearch = item.label_kor
				.toLowerCase()
				.includes(searchInput.toLowerCase());
			const matchesSets =
				selectedSets === "all" || item.effect.sets?.includes(selectedSets);
			return matchesSearch && matchesSets;
		});

	const handleAddItem = (itemValue: string) => {
		const artifact = artifacts.find((a) => a.value === itemValue);

		const alreadyExists = fieldValue.some(
			(item: ArtifactInstance["item"]) => item.value === itemValue,
		);

		if (artifact?.effect.content?.includes("고유") && alreadyExists) {
			toast("이미 리스트에 동일한 [고유]효과의 아티팩트가 존재합니다", {
				position: "top-center",
				style: {
					backgroundColor: "#3e3e3e",
					color: "#ffffff",
				},
			});
			return;
		}

		if (fieldValue[selectIndex]) {
			update(selectIndex, {
				id: fieldValue[selectIndex].id,
				value: itemValue,
			});
		} else {
			append({
				id: crypto.randomUUID(),
				value: itemValue,
			});
		}
		setIsOpen(false);
	};

	return (
		<FormField
			control={form.control}
			name={`lists.${index}.items`}
			render={() => (
				<FormItem>
					<FormControl>
						<Column className="w-full gap-2">
							<Drawer open={isOpen} onOpenChange={setIsOpen}>
								<Row className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 items-center">
									{fieldValue.map(
										(list: { id: string; value: string }, index: number) => (
											<Row key={list.id} className="relative w-max group">
												<Button
													onClick={() => {
														setIsOpen(true);
														setSelectIndex(index);
													}}
													type="button"
													className={`w-16 h-16`}
												>
													<ImageWithFallback
														className="min-w-12 max-w-12 max-h-12 p-0"
														width={48}
														height={48}
														src={
															artifacts.find(
																(item) =>
																	item.value === fieldValue[index].value,
															)?.image || "/"
														}
														alt={fieldValue[index].value}
													/>
												</Button>
												<Button
													type="button"
													className="absolute top-1 right-1 h-max !p-0 hidden group-hover:flex opacity-60"
													variant="ghost"
													onClick={() => {
														remove(index);
													}}
												>
													<X className="text-red-500" />
												</Button>
											</Row>
										),
									)}
									{fieldValue.length < 20 && (
										<Button
											onClick={() => {
												setIsOpen(true);
												setSelectIndex(fieldValue.length);
											}}
											type="button"
											className={`w-16 h-16 opacity-40 hover:opacity-100`}
										>
											<CopyPlus className="text-gray-500" />
										</Button>
									)}
								</Row>
								<DrawerContent className="w-full">
									<DrawerHeader>
										<DrawerTitle>
											<Typography variant="body2">
												아티팩트를 선택해 주세요
											</Typography>
										</DrawerTitle>
									</DrawerHeader>

									<Column className="w-full max-w-3xl mx-auto py-4 md:px-0 px-4 gap-2">
										<Row className="w-full gap-2">
											<Input
												placeholder="아티팩트 검색"
												value={currentValue}
												onChange={(e) => {
													setCurrentValue(e.target.value);
													handleSearch(e.target.value);
												}}
											/>
											<Select
												value={selectedSets}
												onValueChange={setSelectedSets}
											>
												<SelectTrigger className="min-w-28 w-28">
													<SelectValue placeholder="콤보 선택" />
												</SelectTrigger>
												<SelectContent>
													{EFFECT_DATA.map((sets) => (
														<SelectItem key={sets.value} value={sets.value}>
															{sets.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Row>

										<Row className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(48px,1fr))] max-h-[260px] sm:max-h-[400px] overflow-y-auto">
											{filteredItems?.map((item) => (
												<Tooltip delayDuration={400} key={item.value}>
													<TooltipTrigger asChild>
														<Button
															className={`p-0 h-max ${clsx(getTierBorderColor(item.tier))}`}
															onClick={() => handleAddItem(item.value)}
														>
															<ImageWithFallback
																className="min-w-12 max-w-12 max-h-12 p-0"
																width={48}
																height={48}
																src={item.image}
																alt={item.value}
															/>
														</Button>
													</TooltipTrigger>
													<TooltipContent sideOffset={16}>
														<ArtifactTooltip
															data={item as ArtifactInstance["item"]}
														/>
													</TooltipContent>
												</Tooltip>
											))}
										</Row>
									</Column>
								</DrawerContent>
							</Drawer>
							<FormMessage />
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
