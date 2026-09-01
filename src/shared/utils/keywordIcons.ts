import { ARTIFACT_OPTION_FILTERS } from "@/src/entities/artifact/model/artifactOptionFilters";

const INLINE_ICON_EXCLUDED_FILTER_VALUES = ["element_damage"];
const INLINE_ICON_PHRASE_OVERRIDES = [
	{
		icon: "/keywords/BasicAttackDamage.png",
		keywords: [
			"일반 공격 피해량",
			"일반공격피해량",
			"일반 공격 피해",
			"일반공격피해",
		],
		value: "normal_attack_damage",
	},
	{
		icon: "/keywords/DashAttackDamage.png",
		keywords: [
			"대시 공격 피해량",
			"대시공격피해량",
			"대시 공격 피해",
			"대시공격피해",
		],
		value: "dash_attack_damage",
	},
	{
		icon: "/keywords/SpecialAttackDamage.png",
		keywords: [
			"특수 공격 피해량",
			"특수공격피해량",
			"특수 공격 피해",
			"특수공격피해",
		],
		value: "special_attack_damage",
	},
	{
		icon: "/keywords/FinalWeaponDamage.png",
		keywords: [
			"무기 공격 피해량",
			"무기공격피해량",
			"무기 공격 피해",
			"무기공격피해",
		],
		value: "weapon_attack_damage",
	},
	{
		icon: "/keywords/MP.png",
		keywords: ["MP"],
		value: "mp",
	},
	{
		icon: "/keywords/FlameGround.png",
		keywords: ["?붿긽 怨듦꺽 ?띾룄", "?붿긽怨듦꺽?띾룄"],
		value: "burn_attack_speed",
	},
];
const INLINE_ICON_SUPPRESSED_PHRASES = [
	"?됱꽦 怨듦꺽 ?띾룄",
	"?됱꽦怨듦꺽?띾룄",
];

interface KeywordIconMatch {
	end: number;
	icon: string;
	index: number;
	keyword: string;
	value: string;
}

export const getKeywordIconMatches = (text: string) => {
	const lowerText = text.toLowerCase();
	const suppressedRanges = INLINE_ICON_SUPPRESSED_PHRASES.flatMap((phrase) => {
		const ranges: { end: number; index: number }[] = [];
		const lowerPhrase = phrase.toLowerCase();
		let index = lowerText.indexOf(lowerPhrase);

		while (index !== -1) {
			ranges.push({ end: index + phrase.length, index });
			index = lowerText.indexOf(lowerPhrase, index + phrase.length);
		}

		return ranges;
	});
	const phraseOverrideMatches = INLINE_ICON_PHRASE_OVERRIDES.flatMap(
		(override) =>
			override.keywords.flatMap((keyword) => {
				const matches: KeywordIconMatch[] = [];
				const lowerKeyword = keyword.toLowerCase();
				let index = lowerText.indexOf(lowerKeyword);

				while (index !== -1) {
					matches.push({
						end: index + keyword.length,
						icon: override.icon,
						index,
						keyword,
						value: override.value,
					});
					index = lowerText.indexOf(lowerKeyword, index + keyword.length);
				}

				return matches;
			}),
	);

	return [
		...phraseOverrideMatches,
		...ARTIFACT_OPTION_FILTERS.filter(
			(filter) =>
				filter.icon &&
				!INLINE_ICON_EXCLUDED_FILTER_VALUES.includes(filter.value),
		).flatMap((filter) =>
			filter.keywords.flatMap((keyword) => {
				const matches: KeywordIconMatch[] = [];
				const lowerKeyword = keyword.toLowerCase();
				let index = lowerText.indexOf(lowerKeyword);

				while (index !== -1) {
					matches.push({
						end: index + keyword.length,
						icon: filter.icon || "",
						index,
						keyword,
						value: filter.value,
					});
					index = lowerText.indexOf(lowerKeyword, index + keyword.length);
				}

				return matches;
			}),
		),
	]
		.filter(
			(match) =>
				!suppressedRanges.some(
					(range) => match.index >= range.index && match.end <= range.end,
				),
		)
		.filter((match) => !text.slice(match.end).trimStart().startsWith(":"))
		.filter((match) => !text.slice(match.end).trimStart().startsWith("속도"))
		.sort((a, b) => a.index - b.index || b.keyword.length - a.keyword.length)
		.reduce<KeywordIconMatch[]>((matches, match) => {
			const lastMatch = matches.at(-1);

			if (lastMatch && match.index < lastMatch.end) {
				return matches;
			}

			matches.push(match);
			return matches;
		}, []);
};
