// 아이템 데이터 구조 정의
export type SlabsOptions = {
	id: string; // 아이템의 고유 ID
	value: string;
	label: string; // 아이템 효과 종류
	rotation: 0 | 1 | 2 | 3;
	image: string;
};

// 인벤토리 슬롯 ID 타입 (예: "0-0", "1-2")
export type SlotId = string;

// 아이템의 위치를 나타내는 맵
export type ItemPositionMap = Record<SlotId, SlabsOptions | undefined>;
