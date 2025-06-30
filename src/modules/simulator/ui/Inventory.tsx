"use client";

import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { InventorySlot } from "@/src/entities/simulator/item/ui/Inventory";
import { GRID_CONFIG } from "@/src/entities/simulator/item/ui/Slabs";
import type { SlabsOptions, SlotId } from "@/src/entities/simulator/types";
import { DeleteTrash } from "@/src/features/simulator/ui/DeleteTrash";
import { ItemSource } from "@/src/features/simulator/ui/ItemSource";
import { useSlabsEffects } from "@/src/shared/hooks/useSlabsEffects";
import { ITEM_MASTER_DATA } from "@/src/features/simulator/config/SlabsLists";

export default function InventoryApp() {
	const { items, setItems, handleRotate, calculatedEffects } =
		useSlabsEffects();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragStart = (event: any) => {
		setActiveId(event.active.id);
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

			setItems((prevItems) => {
				const newItems = { ...prevItems };
				const targetItem = newItems[overSlotId];

				if (activeIsSource) {
					const sourceItem: SlabsOptions = active.data.current.item;
					if (!targetItem) {
						newItems[overSlotId] = { ...sourceItem, id: `item-${Date.now()}-${sourceItem.id}` };
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
			setItems((prevItems) => {
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

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="flex-grow">
						<h1 className="text-3xl font-bold mb-2">인벤토리</h1>
						<p className="text-gray-400 mb-6">
							아이템을 드래그하여 배치하거나, 위치를 바꾸거나, 삭제하세요.
						</p>
						<div
							className="grid grid-cols-6 gap-2"
							style={{ gridTemplateColumns: "repeat(6, 80px)" }}
						>
							{GRID_CONFIG.map(({ rows: rowIndex, cols }) =>
								Array.from({ length: cols }).map((_, colIndex) => {
									const slotId: SlotId = `${rowIndex}-${colIndex}`;
									const item = items[slotId];
									const effectValue = calculatedEffects[slotId] || 0;
									return (
										<InventorySlot
											key={slotId}
											id={slotId}
											item={item}
											effectValue={effectValue}
											onRotate={handleRotate}
											isOver={overId === slotId}
										/>
									);
								}),
							)}
						</div>
					</div>

					<div className="w-full lg:w-64 flex-shrink-0">
						<h2 className="text-2xl font-bold mb-4">사용 가능 아이템</h2>
						<div className="bg-gray-800 p-4 rounded-lg flex justify-around">
							{ITEM_MASTER_DATA.map((item) => (
							<ItemSource
								key={item.value}
								item={{ id: item.value, label: item.ko_label, ...(item.rotate && {rotation: 0}), image: item.image } as SlabsOptions}
							/>
							))}
						</div>

						<h2 className="text-2xl font-bold mt-8 mb-4">삭제</h2>
						<DeleteTrash isOver={overId === "trash"} />
					</div>
				</div>
			</div>
		</DndContext>
	);
}
