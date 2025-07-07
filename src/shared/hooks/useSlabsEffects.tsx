import { useCallback, useMemo, useState } from "react";
import { SLOT_IDS } from "@/src/entities/simulator/item/ui/Slabs";
import type {
	ItemPositionMap,
	SlabsOptions,
	SlotId,
} from "@/src/entities/simulator/types";
import { getSlabsEffectHandlers } from "@/src/features/simulator/config/getSlabsEffect";

/**
 * 인벤토리 석판의 상태와 효과 계산 로직을 관리하는 커스텀 훅
 */
export const useSlabsEffects = () => {
	const [items, setItems] = useState<ItemPositionMap>({});

	/**
	 * 아이템을 회전시키는 함수.
	 * useCallback을 사용하여 의존성 배열이 변경될 때만 함수를 재생성합니다.
	 */
	const handleRotate = useCallback((itemId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setItems((prevItems) => {
			const itemSlotId = Object.keys(prevItems).find(
				(id) => prevItems[id]?.id === itemId,
			);

			if (!itemSlotId) return prevItems;

			const itemToUpdate = prevItems[itemSlotId];
			if (!itemToUpdate) return prevItems;

			const newItems = {
				...prevItems,
				[itemSlotId]: {
					...itemToUpdate,
					rotation: ((itemToUpdate.rotation + 1) %
						4) as SlabsOptions["rotation"],
				},
			};
			return newItems;
		});
	}, []);

	/**
	 * 아이템 위치에 따른 효과를 계산하는 로직.
	 */
	const calculatedEffects = useMemo(() => {
		const effects: Record<SlotId, number> = {};
		const flag: Record<SlotId, "ignore" | null> = {};
		SLOT_IDS.forEach((id) => {
			effects[id] = 0;
			flag[id] = null;
		});

		Object.entries(items).forEach(([slotId, item]) => {
			if (!item) return;

			const [y, x] = slotId.split("-").map(Number);

			const itemResult = item.id.split("-").pop();
			if (itemResult) {
				getSlabsEffectHandlers[itemResult](x, y, slotId, item, effects, flag);
			}
		});

		return { effects, flag };
	}, [items]);

	return { items, setItems, handleRotate, calculatedEffects };
};
