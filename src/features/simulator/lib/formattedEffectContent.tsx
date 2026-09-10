import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { Typography } from "@/src/shared/ui/typography";
import { getKeywordIconMatches } from "@/src/shared/utils/keywordIcons";
import { renderWithHighlights } from "./renderWithHighlights";

interface FormattedEffectContentProps {
	content: string;
}

const NUMBER_REGEX = /([-+]?\d+(?:\.\d+)?(?:\/[-+]?\d+(?:\.\d+)?)+%?)/g;

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
