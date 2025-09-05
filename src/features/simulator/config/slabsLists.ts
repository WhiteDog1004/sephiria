export type SlabsData = {
	value: string;
	ko_label: string;
	eng_label: string;
	image: string;
	rotate?: boolean;
	tier: string;
};

// 모든 석판의 원본 데이터를 배열로 관리
export const ITEM_SLABS_DATA: SlabsData[] = [
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
	{
		value: "past",
		tier: "advanced",
		ko_label: "과거",
		eng_label: "past",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//past.png",
		rotate: true,
	},
	{
		value: "future",
		tier: "advanced",
		ko_label: "미래",
		eng_label: "future",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//future.png",
		rotate: true,
	},
	{
		value: "distribution",
		tier: "advanced",
		ko_label: "분배",
		eng_label: "distribution",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//distribution.png",
	},
	{
		value: "triceps",
		tier: "advanced",
		ko_label: "삼두",
		eng_label: "triceps",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//triceps.png",
	},
	{
		value: "harvesting",
		tier: "advanced",
		ko_label: "수확",
		eng_label: "harvesting",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//harvesting.png",
		rotate: true,
	},
	{
		value: "binary_star",
		tier: "advanced",
		ko_label: "쌍성",
		eng_label: "binary_star",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//binary_star.png",
		rotate: true,
	},
	{
		value: "nurture",
		tier: "advanced",
		ko_label: "양육",
		eng_label: "nurture",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//nurture.png",
		rotate: true,
	},
	{
		value: "yearning",
		tier: "advanced",
		ko_label: "열망",
		eng_label: "yearning",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//yearning.png",
	},
	{
		value: "agglutination",
		tier: "advanced",
		ko_label: "응집",
		eng_label: "agglutination",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//agglutination.png",
		rotate: true,
	},
	{
		value: "entrance",
		tier: "advanced",
		ko_label: "입구",
		eng_label: "entrance",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//entrance.png",
	},
	{
		value: "joke",
		tier: "advanced",
		ko_label: "장난",
		eng_label: "joke",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//joke.png",
		rotate: true,
	},
	{
		value: "load",
		tier: "advanced",
		ko_label: "적재",
		eng_label: "load",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//load.png",
		rotate: true,
	},
	{
		value: "transition",
		tier: "advanced",
		ko_label: "전이",
		eng_label: "transition",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//transition.png",
		rotate: true,
	},
	{
		value: "advance",
		tier: "advanced",
		ko_label: "전진",
		eng_label: "advance",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//advance.png",
		rotate: true,
	},
	{
		value: "justice",
		tier: "advanced",
		ko_label: "정의",
		eng_label: "justice",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//justice.png",
	},
	{
		value: "preparation",
		tier: "advanced",
		ko_label: "준비",
		eng_label: "preparation",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//preparation.png",
		rotate: true,
	},
	{
		value: "exit",
		tier: "advanced",
		ko_label: "출구",
		eng_label: "exit",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//exit.png",
	},
	{
		value: "tide",
		tier: "advanced",
		ko_label: "파도",
		eng_label: "tide",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//tide.png",
		rotate: true,
	},
	{
		value: "dedication",
		tier: "advanced",
		ko_label: "헌정",
		eng_label: "dedication",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//dedication.png",
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
	{
		value: "warrant",
		tier: "rare",
		ko_label: "권능",
		eng_label: "warrant",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//warrant.png",
		rotate: true,
	},
	{
		value: "disconnection",
		tier: "rare",
		ko_label: "단절",
		eng_label: "disconnection",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//disconnection.png",
	},
	{
		value: "concurrency",
		tier: "rare",
		ko_label: "동시성",
		eng_label: "concurrency",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//concurrency.png",
	},
	{
		value: "vow",
		tier: "rare",
		ko_label: "맹세",
		eng_label: "vow",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//vow.png",
		rotate: true,
	},
	{
		value: "rebellion",
		tier: "rare",
		ko_label: "반항",
		eng_label: "rebellion",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//rebellion.png",
		rotate: true,
	},
	{
		value: "connection",
		tier: "rare",
		ko_label: "이음",
		eng_label: "connection",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//connection.png",
		rotate: true,
	},
	{
		value: "shade",
		tier: "rare",
		ko_label: "차양",
		eng_label: "shade",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//shade.png",
	},

	// LEGEND
	{
		value: "thorn",
		tier: "legend",
		ko_label: "가시",
		eng_label: "thorn",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//thorn.png",
	},
	{
		value: "boundary",
		tier: "legend",
		ko_label: "경계",
		eng_label: "boundary",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//boundary.png",
	},
	{
		value: "sheen",
		tier: "legend",
		ko_label: "광휘",
		eng_label: "sheen",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//sheen.png",
		rotate: true,
	},
	{
		value: "miracle",
		tier: "legend",
		ko_label: "기적",
		eng_label: "miracle",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//miracle.png",
	},
	{
		value: "daydream",
		tier: "legend",
		ko_label: "백일몽",
		eng_label: "daydream",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//daydream.png",
		rotate: true,
	},
	{
		value: "compression",
		tier: "legend",
		ko_label: "압축",
		eng_label: "compression",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//compression.png",
		rotate: true,
	},
	{
		value: "certitude",
		tier: "legend",
		ko_label: "확신",
		eng_label: "certitude",
		image:
			"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/slabs//certitude.png",
		rotate: true,
	},
];
