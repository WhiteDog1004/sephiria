import { useCallback, useMemo, useState } from "react";
import { generateGridConfig } from "@/src/entities/simulator/item/ui/SlotComponent";
import type {
	ArtifactPositionMap,
	ItemPositionMap,
	SlabsOptions,
	SlotId,
} from "@/src/entities/simulator/types";
import { getSlabsEffectHandlers } from "@/src/features/simulator/config/getSlabsEffect";
import { getArtifactLevelContent } from "../lib/getArtifactLevelContent";

/**
 * 인벤토리 석판의 상태와 효과 계산 로직을 관리하는 커스텀 훅
 */
export const useSlabsEffects = () => {
	const [slabs, setSlabs] = useState<ItemPositionMap>({});
	const [artifacts, setArtifacts] = useState<ArtifactPositionMap>({});
	const [slotNum, setSlotNum] = useState<number>(34);

	/**
	 * 아이템을 회전시키는 함수.
	 * useCallback을 사용하여 의존성 배열이 변경될 때만 함수를 재생성합니다.
	 */
	const handleRotate = useCallback((itemId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setSlabs((prevItems) => {
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
		generateGridConfig(slotNum)
			.flatMap(({ rows, cols }) =>
				Array.from({ length: cols }, (_, colIndex) => `${rows}-${colIndex}`),
			)
			.forEach((id) => {
				effects[id] = 0;
				flag[id] = null;
			});

		Object.entries(slabs).forEach(([slotId, item]) => {
			if (!item) return;
			const [y, x] = slotId.split("-").map(Number);
			const itemType = item.id.split("-").pop();
			if (itemType && getSlabsEffectHandlers[itemType]) {
				getSlabsEffectHandlers[itemType](
					x,
					y,
					slotId,
					item,
					effects,
					flag,
					generateGridConfig(slotNum),
				);
			}
		});

		return { effects, flag };
	}, [slabs, slotNum]);

	const enhancedArtifacts = useMemo(() => {
		const enhanced: Record<
			SlotId,
			{
				slabBonus: number;
				baseLevel: number;
				finalLevel: number;
				finalEffectContent: string;
			}
		> = {};

		Object.entries(artifacts).forEach(([slotId, artifact]) => {
			if (!artifact) return;

			const slabBonus = calculatedEffects.effects[slotId] || 0;
			const baseLevel = artifact.item?.level ?? 0;
			const finalLevel = baseLevel + slabBonus;

			const finalEffectContent = getArtifactLevelContent(
				artifact.item?.effect?.content,
				finalLevel,
			);

			enhanced[slotId] = {
				slabBonus,
				baseLevel,
				finalLevel,
				finalEffectContent,
			};
		});

		return enhanced;
	}, [artifacts, calculatedEffects]);

	return {
		slabs,
		setSlabs,
		artifacts,
		setArtifacts,
		slotNum,
		setSlotNum,
		handleRotate,
		calculatedEffects,
		enhancedArtifacts,
	};
};
