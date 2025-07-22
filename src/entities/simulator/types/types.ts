import type { Database } from "@/types_db";

// 아이템 데이터 구조 정의
export type SlabsOptions = {
	id: string; // 아이템의 고유 ID
	value: string;
	label: string; // 아이템 효과 종류
	rotation: 0 | 1 | 2 | 3;
	image: string;
	type?: "slabs" | "artifact";
};

export interface ItemSourceProps {
	item: {
		type: "slabs" | "artifact";
		id: string;
		label: string;
		rotation?: number;
		image: string;
		data?: ArtifactInstance["item"];
	};
}

// 인벤토리 SlotId (예: "0-0", "1-2")
export type SlotId = string;

// 아이템의 위치를 나타내는 맵
export type ItemPositionMap = Record<SlotId, SlabsOptions | undefined>;

// 인벤토리에 놓인 아티팩트의 상태를 정의
export type ArtifactInstance = {
	instanceId: string;
	type: string;
	image: string;
	item: Database["public"]["Tables"]["artifacts"]["Row"];
};

// 아티팩트의 위치를 관리하는 맵 타입
export type ArtifactPositionMap = Record<SlotId, ArtifactInstance | undefined>;
