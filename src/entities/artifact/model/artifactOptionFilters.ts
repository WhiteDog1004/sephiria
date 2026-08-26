export interface ArtifactOptionFilter {
	value: string;
	label: string;
	keywords: string[];
	icon?: string;
	excludeKeywords?: string[];
}

const withSpacingVariants = (keyword: string) => [
	keyword,
	keyword.replace(/\s/g, ""),
];

const withNegativeVariants = (keyword: string) => [
	`${keyword} -`,
	`${keyword.replace(/\s/g, "")}-`,
];

export const ARTIFACT_OPTION_FILTERS: ArtifactOptionFilter[] = [
	{
		value: "max_hp",
		label: "최대 HP",
		icon: "/keywords/HP.png",
		keywords: [
			withSpacingVariants("최대 HP"),
			withSpacingVariants("최종 HP"),
		].flat(),
	},
	{
		value: "hp_absorb",
		label: "HP 흡수",
		icon: "/keywords/HPSteal.png",
		keywords: withSpacingVariants("HP 흡수"),
	},
	{
		value: "max_mp",
		label: "최대 MP",
		icon: "/keywords/MP.png",
		keywords: [
			withSpacingVariants("최대 MP"),
			withSpacingVariants("최종 MP"),
		].flat(),
	},
	{
		value: "mp_regen",
		label: "MP 재생",
		icon: "/keywords/MPRegen.png",
		keywords: withSpacingVariants("MP 재생"),
	},
	{
		value: "mp_absorb",
		label: "MP 흡수",
		icon: "/keywords/MPSteal.png",
		keywords: withSpacingVariants("MP 흡수"),
	},
	{
		value: "move_speed",
		label: "이동 속도",
		icon: "/keywords/MoveSpeed.png",
		keywords: withSpacingVariants("이동 속도"),
		excludeKeywords: [
			...withNegativeVariants("이동 속도"),
			"이동 속도를",
			"이동 속도 감소",
		],
	},
	{
		value: "attack_speed",
		label: "공격 속도",
		icon: "/keywords/AttackSpeed.png",
		keywords: withSpacingVariants("공격 속도"),
		excludeKeywords: [
			...withNegativeVariants("공격 속도"),
			"공격 속도의",
			"공격 속도 감소",
		],
	},
	{
		value: "crit_chance",
		label: "치명타 확률",
		icon: "/keywords/CriticalChance.png",
		keywords: withSpacingVariants("치명타 확률"),
		excludeKeywords: ["발사 확률", "확률로"],
	},
	{
		value: "crit_damage",
		label: "치명타 피해",
		icon: "/keywords/CriticalDamageRate.png",
		keywords: withSpacingVariants("치명타 피해"),
		excludeKeywords: ["[피해량:", "피해량:"],
	},
	{
		value: "defense",
		label: "방어력",
		icon: "/keywords/Defense.png",
		keywords: ["방어력"],
		excludeKeywords: [...withNegativeVariants("방어력"), "방어력의"],
	},
	{
		value: "defense_pierce",
		label: "방어 관통",
		icon: "/keywords/IgnoreDefense.png",
		keywords: withSpacingVariants("방어 관통"),
	},
	{
		value: "evasion",
		label: "회피",
		icon: "/keywords/Evasion.png",
		keywords: ["회피"],
		excludeKeywords: [
			...withNegativeVariants("회피"),
			"회피 성공",
			"회피 발동",
		],
	},
	{
		value: "luck",
		label: "행운",
		icon: "/keywords/Luck.png",
		keywords: ["행운"],
	},
	{
		value: "leaf",
		label: "잎",
		icon: "/keywords/Leaf.png",
		keywords: ["잎 획득", "잎 생성"],
	},
	{
		value: "bargaining",
		label: "협상력",
		icon: "/keywords/Negotiation.png",
		keywords: ["협상력"],
	},
	{
		value: "damage_amp",
		label: "피해 증폭",
		icon: "/keywords/FinalDamage.png",
		keywords: withSpacingVariants("피해 증폭"),
	},
	{
		value: "weapon_damage",
		label: "무기 피해량",
		icon: "/keywords/FinalWeaponDamage.png",
		keywords: withSpacingVariants("무기 피해량"),
	},
	{
		value: "spell_damage",
		label: "마법서 피해량",
		icon: "/keywords/MagicDamageBonus.png",
		keywords: withSpacingVariants("마법서 피해량"),
	},
	{
		value: "magic_haste",
		label: "마법 가속",
		icon: "/keywords/CooldownRecovey.png",
		keywords: [
			withSpacingVariants("마법 가속"),
			withSpacingVariants("마법서 가속"),
		].flat(),
		excludeKeywords: [
			...withNegativeVariants("마법 가속"),
			...withNegativeVariants("마법서 가속"),
		],
	},
	{
		value: "dash_count",
		label: "대시 횟수",
		icon: "/keywords/DashDistance.png",
		keywords: withSpacingVariants("대시 횟수"),
		excludeKeywords: ["대시 횟수 소모", "대시 횟수 소모시"],
	},
	{
		value: "dash_recovery",
		label: "대시 회복",
		icon: "/keywords/DashRecovery.png",
		keywords: withSpacingVariants("대시 회복"),
	},
	{
		value: "dash_damage",
		label: "대시 공격",
		icon: "/keywords/DashAttackDamage.png",
		keywords: withSpacingVariants("대시 공격"),
	},
	{
		value: "normal_attack",
		label: "일반 공격",
		icon: "/keywords/BasicAttackDamage.png",
		keywords: withSpacingVariants("일반 공격"),
		excludeKeywords: ["일반 공격 시", "일반 공격 마지막"],
	},
	{
		value: "special_attack",
		label: "특수 공격",
		icon: "/keywords/SpecialAttackDamage.png",
		keywords: withSpacingVariants("특수 공격"),
		excludeKeywords: ["특수 공격 사용", "특수 공격 비용 감소"],
	},
	{
		value: "physical_damage",
		label: "물리 피해",
		icon: "/keywords/PhysicalDamage.png",
		keywords: [
			withSpacingVariants("물리 피해"),
			withSpacingVariants("물리피해"),
		].flat(),
		excludeKeywords: ["[피해량:", "피해량:", "물리 피해의"],
	},
	{
		value: "fixed_damage",
		label: "고정 피해",
		icon: "/keywords/TrueDamage.png",
		keywords: withSpacingVariants("고정 피해"),
	},
	{
		value: "fire_damage",
		label: "화염속성 피해",
		icon: "/keywords/FireSpeed.png",
		keywords: [
			...withSpacingVariants("화염속성 피해"),
			...withSpacingVariants("화염 속성 피해"),
		],
		excludeKeywords: ["[피해량:", "피해량:", "피해를 가함"],
	},
	{
		value: "ice_damage",
		label: "얼음속성 피해",
		icon: "/keywords/IceDamage.png",
		keywords: [
			...withSpacingVariants("얼음속성 피해"),
			...withSpacingVariants("얼음 속성 피해"),
		],
		excludeKeywords: ["[피해량:", "피해량:", "피해를 가함", "얼음 속성 피해에"],
	},
	{
		value: "lightning_damage",
		label: "번개속성 피해",
		icon: "/keywords/LightningDamage.png",
		keywords: [
			...withSpacingVariants("번개속성 피해"),
			...withSpacingVariants("번개 속성 피해"),
		],
		excludeKeywords: ["[피해량:", "피해량:", "피해를 가함"],
	},
	{
		value: "element_damage",
		label: "속성 피해",
		icon: "/keywords/AllElementalDamage.png",
		keywords: withSpacingVariants("속성 피해"),
	},
	{
		value: "burn",
		label: "화상",
		icon: "/keywords/FireSpeed.png",
		keywords: ["화상"],
	},
	{
		value: "shock",
		label: "감전",
		icon: "/keywords/LightningDamage.png",
		keywords: ["감전"],
	},
	{
		value: "frost",
		label: "동상/빙결",
		icon: "/keywords/IceDamage.png",
		keywords: ["동상", "빙결"],
	},
	{
		value: "shield",
		label: "보호막",
		icon: "/keywords/ProtectionPoint.png",
		keywords: ["보호막"],
	},
	{
		value: "colleague",
		label: "동료",
		icon: "/keywords/Companion.png",
		keywords: ["동료", "해파리", "두더지 대장"],
	},
	{
		value: "thorn",
		label: "가시",
		icon: "/keywords/Thorns.png",
		keywords: ["가시"],
		excludeKeywords: ["얼음 가시", "가시 생성", "가시가 적에게"],
	},
];

export const normalizeArtifactOptionText = (text: string) =>
	text.replace(/\s+/g, " ").toLowerCase();

export const matchesArtifactOptionFilter = (
	effectContent: string,
	filter: ArtifactOptionFilter,
) => {
	const normalizedExcludeKeywords = filter.excludeKeywords?.map((keyword) =>
		normalizeArtifactOptionText(keyword),
	);

	return effectContent.split(/\n+/).some((line) => {
		const normalizedLine = normalizeArtifactOptionText(line);
		const hasKeyword = filter.keywords.some((keyword) =>
			normalizedLine.includes(normalizeArtifactOptionText(keyword)),
		);
		const hasExcludedKeyword = normalizedExcludeKeywords?.some((keyword) =>
			normalizedLine.includes(keyword),
		);

		return hasKeyword && !hasExcludedKeyword;
	});
};
