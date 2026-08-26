export interface ArtifactOptionFilter {
	value: string;
	label: string;
	keywords: string[];
}

const withSpacingVariants = (keyword: string) => [
	keyword,
	keyword.replace(/\s/g, ""),
];

export const ARTIFACT_OPTION_FILTERS: ArtifactOptionFilter[] = [
	{
		value: "max_hp",
		label: "최대 HP",
		keywords: [
			withSpacingVariants("최대 HP"),
			withSpacingVariants("최종 HP"),
		].flat(),
	},
	{
		value: "hp_absorb",
		label: "HP 흡수",
		keywords: withSpacingVariants("HP 흡수"),
	},
	{
		value: "max_mp",
		label: "최대 MP",
		keywords: [
			withSpacingVariants("최대 MP"),
			withSpacingVariants("최종 MP"),
		].flat(),
	},
	{
		value: "mp_regen",
		label: "MP 재생",
		keywords: withSpacingVariants("MP 재생"),
	},
	{
		value: "mp_absorb",
		label: "MP 흡수",
		keywords: withSpacingVariants("MP 흡수"),
	},
	{
		value: "move_speed",
		label: "이동 속도",
		keywords: withSpacingVariants("이동 속도"),
	},
	{
		value: "attack_speed",
		label: "공격 속도",
		keywords: withSpacingVariants("공격 속도"),
	},
	{
		value: "crit_chance",
		label: "치명타 확률",
		keywords: withSpacingVariants("치명타 확률"),
	},
	{
		value: "crit_damage",
		label: "치명타 피해",
		keywords: withSpacingVariants("치명타 피해"),
	},
	{ value: "defense", label: "방어력", keywords: ["방어력"] },
	{
		value: "defense_pierce",
		label: "방어 관통",
		keywords: withSpacingVariants("방어 관통"),
	},
	{ value: "evasion", label: "회피", keywords: ["회피"] },
	{ value: "luck", label: "행운", keywords: ["행운"] },
	{ value: "bargaining", label: "협상력", keywords: ["협상력"] },
	{
		value: "damage_amp",
		label: "피해 증폭",
		keywords: withSpacingVariants("피해 증폭"),
	},
	{
		value: "weapon_damage",
		label: "무기 피해량",
		keywords: withSpacingVariants("무기 피해량"),
	},
	{
		value: "spell_damage",
		label: "마법서 피해량",
		keywords: withSpacingVariants("마법서 피해량"),
	},
	{
		value: "spell_haste",
		label: "마법서 가속",
		keywords: withSpacingVariants("마법서 가속"),
	},
	{
		value: "magic_haste",
		label: "마법 가속",
		keywords: withSpacingVariants("마법 가속"),
	},
	{
		value: "dash_count",
		label: "대시 횟수",
		keywords: withSpacingVariants("대시 횟수"),
	},
	{
		value: "dash_recovery",
		label: "대시 회복",
		keywords: withSpacingVariants("대시 회복"),
	},
	{
		value: "dash_damage",
		label: "대시 공격",
		keywords: withSpacingVariants("대시 공격"),
	},
	{
		value: "normal_attack",
		label: "일반 공격",
		keywords: withSpacingVariants("일반 공격"),
	},
	{
		value: "special_attack",
		label: "특수 공격",
		keywords: withSpacingVariants("특수 공격"),
	},
	{
		value: "physical_damage",
		label: "물리 피해",
		keywords: withSpacingVariants("물리 피해"),
	},
	{
		value: "fixed_damage",
		label: "고정 피해",
		keywords: withSpacingVariants("고정 피해"),
	},
	{
		value: "fire_damage",
		label: "화염속성 피해",
		keywords: [
			...withSpacingVariants("화염속성 피해"),
			...withSpacingVariants("화염 속성 피해"),
		],
	},
	{
		value: "ice_damage",
		label: "얼음속성 피해",
		keywords: [
			...withSpacingVariants("얼음속성 피해"),
			...withSpacingVariants("얼음 속성 피해"),
		],
	},
	{
		value: "lightning_damage",
		label: "번개속성 피해",
		keywords: [
			...withSpacingVariants("번개속성 피해"),
			...withSpacingVariants("번개 속성 피해"),
		],
	},
	{
		value: "element_damage",
		label: "속성 피해",
		keywords: withSpacingVariants("속성 피해"),
	},
	{ value: "burn", label: "화상", keywords: ["화상"] },
	{ value: "shock", label: "감전", keywords: ["감전"] },
	{ value: "frost", label: "동상/빙결", keywords: ["동상", "빙결"] },
	{ value: "shield", label: "보호막", keywords: ["보호막"] },
	{ value: "potion", label: "포션", keywords: ["포션"] },
	{
		value: "colleague",
		label: "동료",
		keywords: ["동료", "해파리", "두더지 대장"],
	},
	{ value: "cloud", label: "먹구름", keywords: ["먹구름"] },
	{ value: "ice_weapon", label: "얼음무구", keywords: ["얼음무구"] },
	{ value: "sun_sword", label: "태양검", keywords: ["태양검"] },
	{ value: "vortex", label: "소용돌이", keywords: ["소용돌이"] },
	{ value: "planet", label: "행성", keywords: ["행성"] },
	{ value: "thorn", label: "가시", keywords: ["가시"] },
];

export const normalizeArtifactOptionText = (text: string) =>
	text.replace(/\s+/g, " ").toLowerCase();

export const matchesArtifactOptionFilter = (
	effectContent: string,
	filter: ArtifactOptionFilter,
) => {
	const normalizedContent = normalizeArtifactOptionText(effectContent);
	return filter.keywords.some((keyword) =>
		normalizedContent.includes(normalizeArtifactOptionText(keyword)),
	);
};
