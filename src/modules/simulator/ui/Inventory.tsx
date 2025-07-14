"use client";

import {
	closestCenter,
	DndContext,
	DragOverlay,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { InventorySlot } from "@/src/entities/simulator/item/ui/InventorySlot";
import { GRID_CONFIG } from "@/src/entities/simulator/item/ui/SlotComponent";
import type {
	ArtifactInstance,
	SlabsOptions,
	SlotId,
} from "@/src/entities/simulator/types";
import { TABS_LIST } from "@/src/features/simulator/config/constants";
import { ITEM_SLABS_DATA } from "@/src/features/simulator/config/slabsLists";
import { DeleteTrash } from "@/src/features/simulator/ui/DeleteTrash";
import { ItemSource } from "@/src/features/simulator/ui/ItemSource";
import { SearchSlabs } from "@/src/features/simulator/ui/SearchSlabs";
import { useSlabsEffects } from "@/src/shared/hooks/useSlabsEffects";
import { Box } from "@/src/shared/ui/box";
import { Column } from "@/src/shared/ui/column";
import { Row } from "@/src/shared/ui/row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs";
import { Typography } from "@/src/shared/ui/typography";

interface InventoryProps {
	data: ArtifactInstance["data"][];
}

const Inventory = ({ data }: InventoryProps) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { slabs, setSlabs, artifacts, handleRotate, calculatedEffects } =
		useSlabsEffects();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeItem, setActiveItem] = useState<SlabsOptions | null>(null);
	const [overId, setOverId] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState("");
	const [selectedTier, setSelectedTier] = useState("all");

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragStart = (event: any) => {
		setActiveId(event.active.id);
		setActiveItem(event.active.data.current.item);
	};

	const handleDragOver = (event: any) => {
		setOverId(event.over?.id);
	};

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		setActiveId(null);
		setOverId(null);

		if (!over) return;

		const activeIsSource = active.data.current?.type === "source-item";
		const activeIsItem = active.data.current?.type === "item";

		if (over.data.current?.type === "slot") {
			const overSlotId: SlotId = over.id;

			setSlabs((prevItems) => {
				const newItems = { ...prevItems };
				const targetItem = newItems[overSlotId];

				if (activeIsSource) {
					const sourceItem: SlabsOptions = active.data.current.item;
					if (!targetItem) {
						newItems[overSlotId] = {
							...sourceItem,
							id: `item-${Date.now()}-${sourceItem.id}`,
						};
					}
				} else if (activeIsItem) {
					const activeItem: SlabsOptions = active.data.current.item;
					const originalSlotId = Object.keys(newItems).find(
						(key) => newItems[key]?.id === activeItem.id,
					);
					if (!originalSlotId) return prevItems;

					if (targetItem) {
						newItems[originalSlotId] = targetItem;
						newItems[overSlotId] = activeItem;
					} else {
						delete newItems[originalSlotId];
						newItems[overSlotId] = activeItem;
					}
				}
				return newItems;
			});
		}

		if (over.data.current?.type === "trash" && activeIsItem) {
			const activeItem: SlabsOptions = active.data.current.item;
			setSlabs((prevItems) => {
				const newItems = { ...prevItems };
				const originalSlotId = Object.keys(newItems).find(
					(key) => newItems[key]?.id === activeItem.id,
				);
				if (originalSlotId) {
					delete newItems[originalSlotId];
				}
				return newItems;
			});
		}
	};

	const filteredItems = ITEM_SLABS_DATA.filter((item) => {
		const matchesSearch = item.ko_label
			.toLowerCase()
			.includes(searchInput.toLowerCase());
		const matchesTier = selectedTier === "all" || item.tier === selectedTier;
		return matchesSearch && matchesTier;
	});

	const filteredArtifacts = data.filter((item) => {
		const matchesSearch = item.label_kor
			.toLowerCase()
			.includes(searchInput.toLowerCase());
		return matchesSearch;
	});

	const TabsBoxStyles = `grid h-full max-h-[676] overflow-auto bg-[#2f1c2c] p-4 rounded-lg ${clsx(theme === "light" && "bg-[#2f1c2c80]")}`;

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<Column
				className={`items-start lg:flex-row gap-8 w-max p-8 rounded-sm ${clsx(
					theme === "dark" ? "bg-[#40273b]" : "bg-[#40273b80]",
				)}`}
			>
				<Column className="gap-4 py-0">
					<Column>
						<Typography className="text-2xl font-bold mb-2">
							인벤토리
						</Typography>
						<Typography
							className={`text-gray-400 mb-6 ${clsx(theme === "light" && "text-gray-700")}`}
						>
							석판 및 아티팩트를 드래그하여 배치하세요.
						</Typography>
						<Box
							className="grid grid-cols-6 gap-2 w-max p-0"
							style={{ gridTemplateColumns: "repeat(6, 80px)" }}
						>
							{GRID_CONFIG.map(({ rows: rowIndex, cols }) =>
								Array.from({ length: cols }).map((_, colIndex) => {
									const slotId: SlotId = `${rowIndex}-${colIndex}`;
									const item = slabs[slotId];
									const effectValue = calculatedEffects.effects[slotId] || 0;
									const effectFlag = calculatedEffects.flag[slotId];

									return (
										<InventorySlot
											key={slotId}
											id={slotId}
											item={item as SlabsOptions & ArtifactInstance["data"]}
											effectValue={effectValue}
											effectFlag={effectFlag}
											onRotate={handleRotate}
											isOver={overId === slotId}
										/>
									);
								}),
							)}
						</Box>
					</Column>

					<DeleteTrash isOver={overId === "trash"} />
				</Column>

				<Column className="min-w-[640px] gap-2">
					<Tabs defaultValue={TABS_LIST[0].value}>
						<Row className="justify-between">
							<TabsList>
								{TABS_LIST.map((list) => (
									<TabsTrigger value={list.value} key={list.value}>
										<Typography className="w-full">{list.label}</Typography>
									</TabsTrigger>
								))}
							</TabsList>
							<SearchSlabs
								selectedTier={selectedTier}
								setSelectedTier={setSelectedTier}
								searchInput={searchInput}
								setSearchInput={setSearchInput}
							/>
						</Row>
						<TabsContent value="slabs">
							<Box
								className={`${TabsBoxStyles} ${clsx(filteredItems.length > 0 ? "grid-cols-8" : "grid-cols-1")}`}
							>
								{filteredItems.length > 0 ? (
									filteredItems.map((item) => (
										<ItemSource
											key={item.value}
											item={{
												type: "slabs",
												id: item.value,
												label: item.ko_label,
												...(item.rotate && { rotation: 0 }),
												image: item.image,
											}}
										/>
									))
								) : (
									<Box className="w-full p-0">
										<Typography className="opacity-70">
											검색 결과가 없습니다
										</Typography>
									</Box>
								)}
							</Box>
						</TabsContent>
						<TabsContent value="artifact">
							<Box
								className={`${TabsBoxStyles} ${clsx(filteredArtifacts.length > 0 ? "grid-cols-8" : "grid-cols-1")}`}
							>
								{filteredArtifacts.length > 0 ? (
									filteredArtifacts.map((item) => (
										<ItemSource
											key={item.value}
											item={{
												id: item.value,
												label: item.label_kor,
												image: item.image,
												type: "artifact",
											}}
										/>
									))
								) : (
									<Box className="w-full p-0">
										<Typography className="opacity-70">
											검색 결과가 없습니다
										</Typography>
									</Box>
								)}
							</Box>
						</TabsContent>
					</Tabs>
				</Column>
			</Column>

			<DragOverlay dropAnimation={null}>
				{activeItem && activeId?.startsWith("source-") ? (
					<Box className="relative w-16 h-20 p-0">
						<Image
							unoptimized
							fill
							src={activeItem.image || ""}
							alt={"slabs"}
						/>
					</Box>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};

export default Inventory;
