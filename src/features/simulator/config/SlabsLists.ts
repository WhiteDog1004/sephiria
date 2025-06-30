export type SlabsData = {
	value: string;
	ko_label: string;
	eng_label: string;
	image: string;
	rotate?: boolean;
};

// 모든 아이템의 원본 데이터를 배열로 관리
export const ITEM_MASTER_DATA: SlabsData[] = [
	{
		value: "chivalry",
		ko_label: "기사도",
		eng_label: "chivalry",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//chivalry.png",
		rotate: true,
	},
	{
		value: "base",
		ko_label: "기반",
		eng_label: "base",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//base.png",
	},
	{
		value: "dry",
		ko_label: "건조",
		eng_label: "dry",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//dry.png",
	},
	// 새로운 아이템을 추가하고 싶으면 이 배열에 객체를 추가하면 됩니다.
	// {
	//   value: 'new-item',
	//   ko_label: '새로운 아이템',
	//   eng_label: 'new-item',
	//   image: '...',
	// },
];
