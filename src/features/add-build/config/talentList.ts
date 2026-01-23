export type TalentType =
	| "anger"
	| "rapid"
	| "survival"
	| "patience"
	| "wisdom"
	| "will"
	| "base";

export type TalentLevel = {
	label: string[];
	point: number[];
};

export type TalentStat = Record<number, string>;

export type TalentStatus = {
	level: TalentLevel;
	stat: TalentStat;
};

export type TalentStatusMap = Record<TalentType, TalentStatus>;

export const TALENT_STATUS: TalentStatusMap = {
	anger: {
		level: {
			label: ["치명타 확률"],
			point: [1],
		},
		stat: {
			5: "치명타 피해가 20% 증가합니다.",
			10: "보스와 미니보스에게 주는 피해량이 +10% 증가합니다.",
			20: "방어 관통이 +20% 증가합니다.",
		},
	},
	rapid: {
		level: {
			label: ["공격 속도"],
			point: [1],
		},
		stat: {
			5: "회피가 +8 증가합니다. 대시 횟수가 +1 증가합니다.",
			10: "대시 회복 속도가 +20% 증가합니다. 무기 피해량이 +8% 증가합니다.",
			20: "대시 중 무적 시간 보너스가 +0.1s 증가합니다. 무기 피해량이 +15% 증가합니다.",
		},
	},
	survival: {
		level: {
			label: ["최대 HP"],
			point: [2],
		},
		stat: {
			5: "포션을 먹을 때마다 랜덤한 능력치가 1 증가합니다.",
			10: "추가 인벤토리 슬롯을 3칸 획득합니다.",
			20: "인벤토리가 -12칸 줄어들지만, '석판 각인' 기능이 활성화 됩니다. 석판을 소모하여 해당하는 인벤토리 칸에 효과를 남깁니다.",
		},
	},
	patience: {
		level: {
			label: ["방어력"],
			point: [1],
		},
		stat: {
			5: "석판 기반을 획득합니다.",
			10: "HP가 25 미만일 때, 초당 1씩 회복합니다.",
			20: "사망 시 60%의 체력으로 부활합니다. (1회)",
		},
	},
	wisdom: {
		level: {
			label: ["MP 재생"],
			point: [1],
		},
		stat: {
			5: "MP 흡수가 +5, 최대 MP가 +10 증가합니다.",
			10: "모든 아티팩트는 [고유]효과로 강제되지만, 동일한 아티팩트 획득 시 합쳐지며 아티팩트 레벨이 1 증가합니다. 보스 처치 시 주사위를 1개 획득합니다.",
			20: "매 아이템 보상마다 +1번 무료로 리롤할 수 있습니다. 경험치 드롭이 +20% 증가합니다.",
		},
	},
	will: {
		level: {
			label: ["행운"],
			point: [1],
		},
		stat: {
			5: "시작 주사위 개수가 +2개 증가합니다. 소원 분수 용량이 1 증가합니다.",
			10: "최대 HP가 +15, 최대 MP가 +25 증가합니다.",
			20: "소원 분수 용량 +4",
		},
	},
	base: {
		level: {
			label: ["최대 HP", "회피"],
			point: [1, 0.5],
		},
		stat: {
			5: "추가 인벤토리 슬롯을 2칸 획득합니다.",
			10: "무기, 아이템, 기적의 선택지가 1개 추가됩니다.",
			20: "활성화된 콤보 1종류당 모든 피해 증폭 능력치가 7% 증가합니다.",
		},
	},
};

export const TALENT_NAME: Record<TalentType, string> = {
	anger: "분노",
	rapid: "신속",
	survival: "생존",
	patience: "인내",
	wisdom: "지혜",
	will: "의지",
	base: "기지",
};
