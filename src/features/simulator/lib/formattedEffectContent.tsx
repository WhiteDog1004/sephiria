import clsx from "clsx";
import { Fragment } from "react";
import { Typography } from "@/src/shared/ui/typography";
import { renderWithHighlights } from "./renderWithHighlights";

interface FormattedEffectContentProps {
	content: string;
}

const FormattedEffectContent = ({ content }: FormattedEffectContentProps) => {
	if (!content) {
		return null;
	}

	const processedContent = content.replace(/\[고유\]/g, "[고유]\n");

	const regex = /([-+]?\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)+%?)/g;

	const parts = processedContent.split(regex);

	return (
		<Typography className="whitespace-pre-line" variant="caption">
			{parts.map((part, index) => {
				if (part.includes("<제약>")) {
					const segments = part.split(/(<제약>.*?\n)/);
					return (
						<Fragment key={`${part}-seg`}>
							{segments.map((seg, i) =>
								seg.startsWith("<제약>") ? (
									<Typography
										key={part + seg}
										variant="caption"
										className="inline text-red-400 font-semibold"
									>
										{renderWithHighlights(seg, `${index}-${i}`)}
									</Typography>
								) : (
									<Fragment key={part + seg}>
										{renderWithHighlights(seg, `${index}-${i}`)}
									</Fragment>
								),
							)}
						</Fragment>
					);
				}

				if (index % 2 === 1) {
					const isNegative = part.startsWith("-");
					const isMpConsumption =
						parts[index - 1]?.includes("MP 소모") ?? false;
					const hasPercent = part.endsWith("%");

					const numbersOnly = part.replace(/[-|%]/g, "");
					const numbers = numbersOnly.split("/");

					return (
						<Typography
							className="inline"
							variant="caption"
							key={`${part}-${index}-number`}
						>
							{isNegative && "-"}
							{numbers.map((num, numIndex) => (
								<Fragment key={`${num}-${numIndex}-numbers`}>
									<Typography
										variant="caption"
										className={`inline ${clsx(isNegative && !isMpConsumption ? "text-red-400" : "text-green-500")}`}
									>
										{num}
									</Typography>
									{numIndex < numbers.length - 1 && (
										<Typography className="inline" variant="caption">
											/
										</Typography>
									)}
								</Fragment>
							))}
							{hasPercent && "%"}
						</Typography>
					);
				}

				return (
					<Fragment key={`${part}-render`}>
						{renderWithHighlights(part, index.toString())}
					</Fragment>
				);
			})}
		</Typography>
	);
};

export default FormattedEffectContent;
