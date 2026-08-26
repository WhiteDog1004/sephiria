import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { ARTIFACT_OPTION_FILTERS } from "@/src/entities/artifact/model/artifactOptionFilters";
import { Typography } from "@/src/shared/ui/typography";
import { renderWithHighlights } from "./renderWithHighlights";

interface FormattedEffectContentProps {
	content: string;
}

const NUMBER_REGEX = /([-+]?\d+(?:\.\d+)?(?:\/[-+]?\d+(?:\.\d+)?)+%?)/g;
const INLINE_ICON_EXCLUDED_FILTER_VALUES = ["element_damage"];
const INLINE_ICON_PHRASE_OVERRIDES = [
	{
		icon: "/keywords/FlameGround.png",
		keywords: ["화상 공격 속도", "화상공격속도"],
		value: "burn_attack_speed",
	},
];
const INLINE_ICON_SUPPRESSED_PHRASES = ["행성 공격 속도", "행성공격속도"];

const getKeywordIconMatches = (text: string) => {
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
				const matches: {
					end: number;
					icon: string;
					index: number;
					keyword: string;
					value: string;
				}[] = [];
				const lowerText = text.toLowerCase();
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
				const matches: {
					end: number;
					icon: string;
					index: number;
					keyword: string;
					value: string;
				}[] = [];
				const lowerText = text.toLowerCase();
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
		.sort((a, b) => a.index - b.index || b.keyword.length - a.keyword.length)
		.reduce<
			{
				end: number;
				icon: string;
				index: number;
				keyword: string;
				value: string;
			}[]
		>((matches, match) => {
			const lastMatch = matches.at(-1);

			if (lastMatch && match.index < lastMatch.end) {
				return matches;
			}

			matches.push(match);
			return matches;
		}, []);
};

const renderTextWithKeywordIcons = (text: string, keyPrefix: string) => {
	const matches = getKeywordIconMatches(text);

	if (matches.length === 0) {
		return renderWithHighlights(text, keyPrefix);
	}

	const nodes = [];
	let cursor = 0;

	matches.forEach((match, index) => {
		const beforeText = text.slice(cursor, match.index);
		const keywordText = text.slice(match.index, match.end);

		if (beforeText) {
			nodes.push(
				<Fragment key={`${keyPrefix}-${index}-before`}>
					{renderWithHighlights(beforeText, `${keyPrefix}-${index}-before`)}
				</Fragment>,
			);
		}

		nodes.push(
			<Fragment key={`${keyPrefix}-${index}-keyword`}>
				{renderWithHighlights(keywordText, `${keyPrefix}-${index}-keyword`)}
			</Fragment>,
		);
		nodes.push(
			<Image
				key={`${keyPrefix}-${index}-${match.value}-icon`}
				src={match.icon}
				alt=""
				width={12}
				height={12}
				className="inline-block size-3 shrink-0 align-middle pixelated"
				style={{ transform: "translateY(-2px)" }}
			/>,
		);

		cursor = match.end;
	});

	const afterText = text.slice(cursor);
	if (afterText) {
		nodes.push(
			<Fragment key={`${keyPrefix}-after`}>
				{renderWithHighlights(afterText, `${keyPrefix}-after`)}
			</Fragment>,
		);
	}

	return nodes;
};

const renderFormattedContent = (content: string) => {
	const parts = content.split(NUMBER_REGEX);

	return parts.map((part, index) => {
		if (part.includes("<제약>")) {
			const segments = part.split(/(<제약>.*?\n)/);
			return (
				<Fragment key={`${part}-seg`}>
					{segments.map((seg, i) =>
						seg.startsWith("<제약>") ? (
							<Typography
								key={`${part}-${seg}`}
								variant="caption"
								className="inline text-red-400 font-semibold"
							>
								{renderTextWithKeywordIcons(seg, `${index}-${i}`)}
							</Typography>
						) : (
							<Fragment key={`${part}-${seg}`}>
								{renderTextWithKeywordIcons(seg, `${index}-${i}`)}
							</Fragment>
						),
					)}
				</Fragment>
			);
		}

		if (index % 2 === 1) {
			const isMpConsumption = parts[index - 1]?.includes("MP 소모") ?? false;
			const hasPercent = part.endsWith("%");

			const numbers = part.replace(/%/g, "").split("/");
			let inheritedSign: "-" | "+" | null = null;

			return (
				<Typography
					className="inline"
					variant="caption"
					key={`${part}-${index}-number`}
				>
					{numbers.map((num, numIndex) => {
						const explicitSign = num.startsWith("-")
							? "-"
							: num.startsWith("+")
								? "+"
								: null;
						const sign = explicitSign ?? inheritedSign;
						const value = num.replace(/^[+-]/, "");
						const isPenaltyValue = sign === "-" && !isMpConsumption;
						const colorClass = isPenaltyValue
							? "text-red-400"
							: "text-green-500";

						if (explicitSign) {
							inheritedSign = explicitSign;
						}

						return (
							<Fragment key={`${num}-${numIndex}-numbers`}>
								<Typography
									variant="caption"
									className={`inline ${clsx(colorClass)}`}
								>
									{explicitSign}
									{value}
								</Typography>
								{numIndex < numbers.length - 1 && (
									<Typography className="inline" variant="caption">
										/
									</Typography>
								)}
							</Fragment>
						);
					})}
					{hasPercent && "%"}
				</Typography>
			);
		}

		return (
			<Fragment key={`${part}-${index}-render`}>
				{renderTextWithKeywordIcons(part, index.toString())}
			</Fragment>
		);
	});
};

const FormattedEffectContent = ({ content }: FormattedEffectContentProps) => {
	if (!content) {
		return null;
	}

	const processedContent = content.replace(/\[고유\]/g, "[고유]\n");

	return (
		<Typography className="whitespace-pre-line" variant="caption">
			{renderFormattedContent(processedContent)}
		</Typography>
	);
};

export default FormattedEffectContent;
