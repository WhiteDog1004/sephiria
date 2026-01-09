import type { Database } from "@/types_db";

export type CostumeType = {
	name: string;
	unlock?: string;
	story: string;
	options: string[];
};

export type CostumeMap = {
	[key: string]: CostumeType;
};

export type CostumeDataType = Database["public"]["Tables"]["costume"]["Row"][];

export const COSTUMES: CostumeMap = {
	pink_rabbit: {
		name: "분홍 토끼",
		unlock: undefined,
		story: "특출난 것은 없지만 그것이 장점이 될 수도 있습니다.",
		options: ["경험치 드롭 +3%"],
	},
	rabbit: {
		name: "갑옷을 입은 토끼",
		unlock: undefined,
		story: "몸을 보호하기 위해선 꽁꽁 싸매는 것이 최고 아닐까요?",
		options: ["방어력 +10", "최대 HP -15"],
	},
	brown_rabbit: {
		name: "갈색 토끼",
		unlock: undefined,
		story: "숲에 숨으면 동물들이 잘 못 찾지만, 매사에 성실합니다.",
		options: ["회피 +12", "치명타 확률 -4%"],
	},
	braid: {
		name: "땋은 머리 토끼",
		unlock: undefined,
		story: "땅에 흐르듯이 긴 머리카락을 가지고 있습니다.",
		options: ["공격 속도 +7%", "이동 속도 +12%", "대시 회복 속도 -20%"],
	},
	orange_rabbit: {
		name: "주황색 토끼",
		unlock: undefined,
		story: "알게 모르게 색이 조금씩 다릅니다. 본인만 신경 쓰고 있습니다.",
		options: ["최대 HP +10", "최대 MP -15"],
	},
	red_rabbit: {
		name: "빨간망토 토끼",
		unlock: undefined,
		story: "늑대와의 운명적인 만남을 기다리고 있습니다.",
		options: ["+50% MP 회복 시의 효율", "최대 MP -10"],
	},
	white_rabbit: {
		name: "흰색 토끼",
		unlock: undefined,
		story: "시력이 조금 나쁘지만 매력적입니다.",
		options: ["일반 공격 피해 +8%", "특수 공격 피해 -5%"],
	},
	wing_ear_rabbit: {
		name: "날개 귀 토끼",
		unlock: undefined,
		story:
			"과거 고귀한 혈통으로 떠받들어졌습니다. 지금은 그저 눈길을 끄는 존재일 뿐입니다.",
		options: ["시작 아이템: 축복", "무기 피해량 -10%"],
	},
	red_cat: {
		name: "붉은 옷 고양이",
		unlock: "화염속성 피해 50 달성",
		story: "그늘진 얼굴이지만 모자챙이 넓을 뿐입니다.",
		options: [
			"시작 아이템 : 파이어 볼트",
			"화염속성 피해 +5",
			"얼음속성 피해 -5",
		],
	},
	red_fox: {
		name: "붉은 여우",
		unlock: "석판 10개 동시에 보유",
		story: "귀엽습니다. 그쵸?",
		options: ["인벤토리 슬롯 +6", "치유량 감소 -50%"],
	},
	frog: {
		name: "개구리",
		unlock: "번개속성 피해 50 달성",
		story: "특이하게도 꼬리가 없습니다.",
		options: [
			"시작 아이템 : 라이트닝 볼트",
			"번개속성 피해 +5",
			"화염속성 피해 -5",
		],
	},
	mole: {
		name: "두더지",
		unlock: "두더지 300마리 누적 처치",
		story: "당신은 평범한 일꾼입니다.",
		options: ["방어력 -20", "이동속도 -10%", "동료가 입히는 피해량 +10%"],
	},
	white_wolf: {
		name: "하얀 늑대",
		unlock: "라타카 5회 처치",
		story: "꼬리를 소중히 여기고 있습니다.",
		options: ["무한 대시", "대시 무적 비활성화"],
	},
	wizard_rabbit: {
		name: "위자드 토끼",
		unlock: "마법으로 적 50마리 처치",
		story: "마법 좀 하는 토끼입니다.",
		options: [
			"시작 아이템 : 아이스 볼트",
			"얼음속성 피해 +5",
			"번개속성 피해 -5",
		],
	},
	ghost: {
		name: "유령",
		unlock: "한 모험에서 마법서를 5개 이상 획득",
		story: "희미한 목적이 당신을 이 탑에 묶어두고 있습니다.",
		options: [
			"시작 아이템 : 파이어 애로우",
			"마법서가 MP를 소모하지 않음",
			"무기 피해량 -40%",
		],
	},
	scholar_lizard: {
		name: "학자 도마뱀",
		unlock: "하드 모드 20단계 이상 클리어",
		story: "병약한 몸이지만 커다란 잠재력이 있습니다.",
		options: [
			"시작 아이템 : 세렌의 휘갈긴 편지",
			"마력 환류: 최대 MP가 80으로 고정되고, 줄어들지 않음",
			"최대 HP가 20으로 고정됨",
		],
	},
	skeleton: {
		name: "스켈레톤",
		unlock: "단일 판에서 잃은 체력 누적 333 달성",
		story: "...",
		options: ["사망 시 60% 체력으로 부활 (2회)", "최대 HP가 50으로 고정됨"],
	},
	wings_lost_bat: {
		name: "날개 잃은 박쥐",
		unlock: "헌혈 이벤트 5회 완료",
		story: "햇빛을 얻는 대신 동굴을 잃었습니다. 동족들을 찾고 있습니다.",
		options: ["HP 흡수 +5", "대시 횟수가 1회로 고정됨"],
	},
	adventurer: {
		name: "모험가 토끼",
		unlock: "던그리드 구매",
		story: "모험을 꿈꿔온 당신은 여정을 완수하기 위해 만반의 준비를 합니다.",
		options: ["대시 횟수 +1", "대시 회복 속도 +10%", "마법 가속 -50%"],
	},
	otter: {
		name: "수달",
		unlock: "치명타 피해 175%이상 달성",
		story: "풍부한 표정을 숨길 수 없습니다. 파도같은 감정도 감출 수 없습니다.",
		options: ["치명타 확률 +9%", "이동 속도 -8%"],
	},
	eagle: {
		name: "독수리",
		unlock: "",
		story: "풍부한 표정을 숨길 수 없습니다. 파도같은 감정도 감출 수 없습니다.",
		options: ["대시 횟수 +2", "대시 회복 속도 -20%"],
	},
	crocodile: {
		name: "악어",
		unlock: "",
		story: "이루고자 하는 일을 위해 침묵할 수 있습니다.",
		options: [
			"방어력에 따른 피해 감소가 적용되지 않지만, 증가된 피해 감소율 만큼 주는 피해 증가",
		],
	},
	deer: {
		name: "사슴",
		unlock: "",
		story: "뿔에 신성력이 있다고 믿어져 왔습니다. 옛날 이야기지만요.",
		options: ["소원 분수 용량 +3", "치명타 확률 -90%"],
	},
	lucky_fairy: {
		name: "행운의 요정",
		unlock: "",
		story: "아무도 요정의 정체에 대해 의심하지 않습니다. 본인조차도.",
		options: ["행운 +7", "인벤토리 슬롯 -3"],
	},
	squirrel: {
		name: "농부 다람쥐",
		unlock: "",
		story: "밭일보다 과수원 일을 좋아합니다.",
		options: ["과일 꼬치 상한 +2", "무기 피해량 -14%"],
	},
};
