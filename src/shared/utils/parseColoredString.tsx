import Image from "next/image";
import { Fragment } from "react";
import { Typography } from "@/src/shared";
import { colorMap } from "./colorMap";
import { getKeywordIconMatches } from "./keywordIcons";

const ATTACK_TEXTS = ["일반 공격", "대시 공격", "특수 공격", "무기 공격"];

const renderInlineKeywordIcon = (
	icon: string,
	key: string,
): React.ReactNode => (
	<Image
		key={key}
		src={icon}
		alt=""
		width={12}
		height={12}
		className="inline-block size-3 shrink-0 align-middle pixelated"
		style={{ transform: "translateY(-2px)" }}
	/>
);

const renderTextWithKeywordIcons = (
	text: string,
	keyPrefix: string,
	suppressIcons = false,
): React.ReactNode[] => {
	if (suppressIcons) {
		return [text];
	}

	const matches = getKeywordIconMatches(text);

	if (matches.length === 0) {
		return [text];
	}

	const nodes: React.ReactNode[] = [];
	let cursor = 0;

	matches.forEach((match, index) => {
		const beforeText = text.slice(cursor, match.index);
		const keywordText = text.slice(match.index, match.end);

		if (beforeText) {
			nodes.push(beforeText);
		}

		nodes.push(
			<Fragment key={`${keyPrefix}-${index}-keyword`}>{keywordText}</Fragment>,
		);
		nodes.push(
			renderInlineKeywordIcon(
				match.icon,
				`${keyPrefix}-${index}-${match.value}-icon`,
			),
		);

		cursor = match.end;
	});

	const afterText = text.slice(cursor);
	if (afterText) {
		nodes.push(afterText);
	}

	return nodes;
};

export const parseColoredString = (str: string): React.ReactNode[] => {
	const regex = /\$(\w)([^$]+)\$/g;
	const result: React.ReactNode[] = [];
	let lastIndex = 0;

	let match: RegExpExecArray | null = regex.exec(str);
	while (match !== null) {
		if (match.index > lastIndex) {
			const plainText = str.slice(lastIndex, match.index);
			result.push(
				...renderTextWithKeywordIcons(plainText, `${match.index}-plain`),
			);
		}

		const [full, key, text] = match;
		const colorClass = colorMap[`$${key}`] || "text-black";
		const remainingText = str.slice(match.index + full.length);
		const nextText = remainingText.trimStart();
		const isLabelPrefix = str
			.slice(match.index + full.length)
			.trimStart()
			.startsWith(":");
		const shouldSuppressAttackIcon =
			ATTACK_TEXTS.includes(text) &&
			(nextText.startsWith("의") ||
				nextText.startsWith("피해") ||
				nextText.startsWith("속도"));

		result.push(
			<Typography
				variant="body2"
				key={match.index}
				className={colorClass}
				asChild
			>
				<span>
					{renderTextWithKeywordIcons(
						text,
						`${match.index}-colored`,
						isLabelPrefix || shouldSuppressAttackIcon,
					)}
				</span>
			</Typography>,
		);

		lastIndex = match.index + full.length;
		match = regex.exec(str);
	}

	if (lastIndex < str.length) {
		const plainText = str.slice(lastIndex);
		result.push(...renderTextWithKeywordIcons(plainText, `${lastIndex}-plain`));
	}

	return result;
};
