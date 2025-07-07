export type SlabsData = {
	value: string;
	ko_label: string;
	eng_label: string;
	image: string;
	rotate?: boolean;
	tier: string;
};

// 모든 아이템의 원본 데이터를 배열로 관리
export const ITEM_MASTER_DATA: SlabsData[] = [
	// COMMON
	{
		value: "chivalry",
		tier: "common",
		ko_label: "기사도",
		eng_label: "chivalry",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//chivalry.png",
		rotate: true,
	},
	{
		value: "dry",
		tier: "common",
		ko_label: "건조",
		eng_label: "dry",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//dry.png",
	},
	{
		value: "approximation",
		tier: "common",
		ko_label: "근사",
		eng_label: "approximation",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//approximation.png",
		rotate: true,
	},
	{
		value: "advent",
		tier: "common",
		ko_label: "도래",
		eng_label: "advent",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//advent.png",
		rotate: true,
	},
	{
		value: "linear",
		tier: "common",
		ko_label: "선의",
		eng_label: "linear",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//linear.png",
	},
	{
		value: "sight",
		tier: "common",
		ko_label: "시선",
		eng_label: "sight",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//sight.png",
		rotate: true,
	},
	{
		value: "handshake",
		tier: "common",
		ko_label: "악수",
		eng_label: "handshake",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//handshake.png",
		rotate: true,
	},
	{
		value: "fate",
		tier: "common",
		ko_label: "운명",
		eng_label: "fate",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//fate.webp",
	},
	{
		value: "wit",
		tier: "common",
		ko_label: "재치",
		eng_label: "wit",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//wit.png",
		rotate: true,
	},
	{
		value: "exploitation",
		tier: "common",
		ko_label: "착취",
		eng_label: "exploitation",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//exploitation.png",
		rotate: true,
	},
	{
		value: "unity",
		tier: "common",
		ko_label: "화합",
		eng_label: "unity",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//unity.png",
		rotate: true,
	},
	{
		value: "cheer",
		tier: "common",
		ko_label: "환호",
		eng_label: "cheer",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//cheer.webp",
	},
	{
		value: "hope",
		tier: "common",
		ko_label: "희망",
		eng_label: "hope",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//hope.png",
		rotate: true,
	},

	// ADVANCED
	{
		value: "compete",
		tier: "advanced",
		ko_label: "경쟁",
		eng_label: "compete",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//compete.png",
		rotate: true,
	},
	{
		value: "beating",
		tier: "advanced",
		ko_label: "고동",
		eng_label: "beating",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//beating.png",
		rotate: true,
	},
	{
		value: "home_town",
		tier: "advanced",
		ko_label: "고양",
		eng_label: "home_town",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//home-town.png",
		rotate: true,
	},

	// RARE
	{
		value: "base",
		tier: "rare",
		ko_label: "기반",
		eng_label: "base",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//base.png",
	},
];
