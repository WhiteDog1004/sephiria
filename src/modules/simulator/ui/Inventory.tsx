"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { InventorySlot } from "@/src/entities/simulator/item/ui/InventorySlot";
import { generateGridConfig } from "@/src/entities/simulator/item/ui/SlotComponent";
import type {
	ArtifactInstance,
	ItemPositionMap,
	SlabsOptions,
	SlotId,
} from "@/src/entities/simulator/types";
import { TABS_LIST } from "@/src/features/simulator/config/constants";
import { ITEM_SLABS_DATA } from "@/src/features/simulator/config/slabsLists";
import { useSlabsEffects } from "@/src/features/simulator/model/useSlabsEffects";
import { DeleteTrash } from "@/src/features/simulator/ui/DeleteTrash";
import { ItemSource } from "@/src/features/simulator/ui/ItemSource";
import { SearchItems } from "@/src/features/simulator/ui/SearchItems";
import { Box } from "@/src/shared/ui/box";
import { Button } from "@/src/shared/ui/button";
import { Column } from "@/src/shared/ui/column";
import { Row } from "@/src/shared/ui/row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs";
import { Typography } from "@/src/shared/ui/typography";
import { handleSlotNumber } from "../model/handleSlotNumber";

interface InventoryProps {
	data: ArtifactInstance["item"][];
}

const Inventory = ({ data }: InventoryProps) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const {
		slabs,
		setSlabs,
		artifacts,
		setArtifacts,
		handleRotate,
		slotNum,
		setSlotNum,
		calculatedEffects,
	} = useSlabsEffects();
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [activeItem, setActiveItem] = useState<
		(SlabsOptions & ArtifactInstance) | null
	>(null);
	const [overId, setOverId] = useState<UniqueIdentifier | undefined | null>(
		null,
	);
	const [tabsValue, setTabsValue] = useState<"slabs" | "artifact">("slabs");
	const [searchInput, setSearchInput] = useState("");
	const [selectedTier, setSelectedTier] = useState("all");

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id);
		setActiveItem(event.active.data.current?.item);
	};

	const handleDragOver = (event: DragOverEvent) => {
		setOverId(event.over?.id);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		setOverId(null);
		setActiveItem(null);

		if (!over) return;

		const activeIsSource = active.data.current?.type === "source-item";
		const activeIsItem = active.data.current?.type === "item";
		const overIsSlot = over.data.current?.type === "slot";
		const itemType = active.data.current?.item?.type;

		if (overIsSlot) {
			const overSlotId: SlotId = over.id;

			if (itemType === "slabs") {
				const activeSlab: SlabsOptions = active.data.current?.item;
				const targetSlab = slabs[overSlotId];
				const targetArtifact = artifacts[overSlotId];

				if (activeIsSource) {
					if (!targetSlab && !targetArtifact) {
						setSlabs(
							(prev) =>
								({
									...prev,
									[overSlotId]: {
										id: `slab-${Date.now()}-${activeSlab.id}`,
										value: activeSlab.id,
										type: "slabs",
										label: activeSlab.label,
										rotation: activeSlab.rotation ?? 0,
										image: activeSlab.image,
									},
								}) as ItemPositionMap,
						);
					}
				} else if (activeIsItem) {
					const originalSlotId = Object.keys(slabs).find(
						(key) => slabs[key]?.id === activeSlab.id,
					);
					if (!originalSlotId) return;

					if (targetSlab) {
						setSlabs((prev) => ({
							...prev,
							[originalSlotId]: targetSlab,
							[overSlotId]: activeSlab,
						}));
					} else if (targetArtifact) {
						setSlabs((prev) => {
							const newSlabs = { ...prev };
							delete newSlabs[originalSlotId];
							newSlabs[overSlotId] = activeSlab;
							return newSlabs;
						});
						setArtifacts((prev) => {
							const newArtifacts = { ...prev };
							delete newArtifacts[overSlotId];
							newArtifacts[originalSlotId] = targetArtifact;
							return newArtifacts;
						});
					} else {
						setSlabs((prev) => {
							const newSlabs = { ...prev };
							delete newSlabs[originalSlotId];
							newSlabs[overSlotId] = activeSlab;
							return newSlabs;
						});
					}
				}
			}

			if (itemType === "artifact") {
				const activeArtifact = active.data.current?.item;
				const targetArtifact = artifacts[overSlotId];
				const targetSlab = slabs[overSlotId];

				if (activeIsSource) {
					if (!targetArtifact && !targetSlab) {
						setArtifacts((prev) => ({
							...prev,
							[overSlotId]: {
								instanceId: `artifact-${Date.now()}`,
								type: "artifact",
								item: activeArtifact.data as ArtifactInstance["item"],
								image: activeArtifact.image,
							},
						}));
					}
				} else if (activeIsItem) {
					const originalSlotId = Object.keys(artifacts).find(
						(key) => artifacts[key]?.instanceId === activeArtifact.instanceId,
					);
					if (!originalSlotId) return;

					if (targetArtifact) {
						setArtifacts((prev) => ({
							...prev,
							[originalSlotId]: targetArtifact,
							[overSlotId]: activeArtifact,
						}));
					} else if (targetSlab) {
						setArtifacts((prev) => {
							const newArtifacts = { ...prev };
							delete newArtifacts[originalSlotId];
							newArtifacts[overSlotId] = activeArtifact;
							return newArtifacts;
						});
						setSlabs((prev) => {
							const newSlabs = { ...prev };
							delete newSlabs[overSlotId];
							newSlabs[originalSlotId] = targetSlab;
							return newSlabs;
						});
					} else {
						setArtifacts((prev) => {
							const newArtifacts = { ...prev };
							delete newArtifacts[originalSlotId];
							newArtifacts[overSlotId] = activeArtifact;
							return newArtifacts;
						});
					}
				}
			}
		}

		if (over.data.current?.type === "trash" && activeIsItem) {
			const itemType = active.data.current?.item?.type;

			if (itemType === "slabs") {
				const activeItem: SlabsOptions = active.data.current?.item;
				setSlabs((prevItems) => {
					const newItems = { ...prevItems };
					const originalSlotId = Object.keys(newItems).find(
						(key) => newItems[key]?.id === activeItem.id,
					);
					if (originalSlotId) delete newItems[originalSlotId];
					return newItems;
				});
			} else if (itemType === "artifact") {
				const activeItem: ArtifactInstance = active.data.current?.item;
				setArtifacts((prevItems) => {
					const newItems = { ...prevItems };
					const originalSlotId = Object.keys(newItems).find(
						(key) => newItems[key]?.instanceId === activeItem.instanceId,
					);
					if (originalSlotId) delete newItems[originalSlotId];
					return newItems;
				});
			}
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
		const matchesTier = selectedTier === "all" || item.tier === selectedTier;
		return matchesSearch && matchesTier;
	});

	const TabsBoxStyles = `grid h-full max-h-[676] overflow-auto bg-[#2f1c2c] p-4 rounded-lg ${clsx(theme === "light" && "bg-gray-300")}`;

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
					theme === "dark" ? "bg-[#40273b]" : "bg-gray-100",
				)}`}
			>
				<Column className="gap-4 py-0">
					<Column>
						<Row>
							<Column className="w-full gap-2">
								<Typography className="text-2xl font-bold">인벤토리</Typography>
								<Typography
									className={`text-gray-400 mb-6 ${clsx(theme === "light" && "text-gray-700")}`}
								>
									석판 및 아티팩트를 드래그하여 배치하세요.
								</Typography>
							</Column>
							<Column className="gap-2">
								<Box className="gap-4 max-w-40 p-0">
									<Button
										disabled={slotNum <= 18}
										size="sm"
										onClick={() =>
											handleSlotNumber({ slotNum, setSlotNum, type: "minus" })
										}
									>
										<Minus />
									</Button>
									<Typography>{slotNum}</Typography>
									<Button
										disabled={slotNum >= 60}
										size="sm"
										onClick={() =>
											handleSlotNumber({ slotNum, setSlotNum, type: "plus" })
										}
									>
										<Plus />
									</Button>
								</Box>
								<Typography
									variant="caption"
									className={`text-gray-400 ${clsx(theme === "light" && "text-gray-700")}`}
								>
									최대 인벤토리 슬롯 설정
								</Typography>
							</Column>
						</Row>
						<Box
							className="grid grid-cols-6 gap-2 w-max p-0"
							style={{ gridTemplateColumns: "repeat(6, 80px)" }}
						>
							{generateGridConfig(slotNum).map(({ rows: rowIndex, cols }) =>
								Array.from({ length: cols }).map((_, colIndex) => {
									const slotId: SlotId = `${rowIndex}-${colIndex}`;
									const item = slabs[slotId];
									const artifact = artifacts[slotId];
									const effectValue = calculatedEffects.effects[slotId] || 0;
									const effectFlag = calculatedEffects.flag[slotId];

									return (
										<InventorySlot
											key={slotId}
											id={slotId}
											item={
												(item || artifact) as SlabsOptions & ArtifactInstance
											}
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
					<Tabs
						onValueChange={(value) =>
							setTabsValue(value as "slabs" | "artifact")
						}
						defaultValue={tabsValue}
					>
						<Row className="justify-between">
							<TabsList>
								{TABS_LIST.map((list) => (
									<TabsTrigger value={list.value} key={list.value}>
										<Typography className="w-full">{list.label}</Typography>
									</TabsTrigger>
								))}
							</TabsList>
							<SearchItems
								type={tabsValue}
								selectedTier={selectedTier}
								setSelectedTier={setSelectedTier}
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
											key={item.value + item.id}
											item={{
												id: item.value,
												label: item.label_kor,
												type: "artifact",
												data: item,
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
					</Tabs>
				</Column>
			</Column>

			<DragOverlay dropAnimation={null}>
				{activeItem &&
					typeof activeId === "string" &&
					activeId.startsWith("source-") && (
						<Box className="relative w-16 h-20 p-0">
							<Image
								unoptimized
								fill
								src={
									activeItem.item
										? activeItem.item.image
										: activeItem.image || ""
								}
								alt={"item-image"}
							/>
						</Box>
					)}
			</DragOverlay>
		</DndContext>
	);
};

export default Inventory;
