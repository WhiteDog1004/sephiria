import clsx from "clsx";
import debounce from "lodash.debounce";
import { CopyPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	getRarityValue,
	type Rarity,
} from "@/src/features/simulator/lib/getRarityOrder";
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
	ImageWithFallback,
	Input,
	Row,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
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

	const { append, update } = useFieldArray({
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
						<Drawer open={isOpen} onOpenChange={setIsOpen}>
							<Row className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 items-center">
								{fieldValue.map(
									(list: { id: string; value: string }, index: number) => (
										<Button
											onClick={() => {
												setIsOpen(true);
												setSelectIndex(index);
											}}
											key={list.id}
											type="button"
											className={`w-16 h-16`}
										>
											<ImageWithFallback
												className="min-w-12 max-w-12 max-h-12 p-0"
												width={48}
												height={48}
												src={
													filteredItems.find(
														(item) => item.value === fieldValue[index].value,
													)?.image || "/"
												}
												alt={fieldValue[index].value}
											/>
										</Button>
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

									<Row className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(48px,1fr))] max-h-[400px] overflow-y-auto">
										{filteredItems?.map((item) => (
											<Button
												className={`p-0 h-max ${clsx(getTierBorderColor(item.tier))}`}
												key={item.value}
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
										))}
									</Row>
								</Column>
							</DrawerContent>
						</Drawer>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
