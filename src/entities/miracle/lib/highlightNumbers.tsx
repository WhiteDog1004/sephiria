import { Typography } from "@/src/shared/ui/typography";

export const highlightNumbers = (text: string, isPenalty = false) => {
	const regex = /([+-]\d+(?:\.\d+)?%?)/g;
	const [prefix, suffix] = text.split(/:(.+)/);
	const targetText = suffix ?? prefix;

	if (isPenalty && !text.includes("-")) {
		return (
			<>
				{suffix && <Typography variant="body2">{prefix}:</Typography>}
				<Typography variant="body2" className="text-red-500">
					{targetText}
				</Typography>
			</>
		);
	}

	if (!isPenalty && !text.includes("+")) {
		return (
			<>
				{suffix && <Typography variant="body2">{prefix}:</Typography>}
				<Typography variant="body2" className="text-green-500">
					{targetText}
				</Typography>
			</>
		);
	}

	const parts = text.split(regex);

	return parts.filter(Boolean).map((part, i) => {
		if (regex.test(part)) {
			const isNegative = part.startsWith("-");
			const colorClass = isNegative ? "text-red-500" : "text-green-500";
			return (
				<Typography key={i} variant="body2" className={colorClass}>
					{part}
				</Typography>
			);
		}
		return (
			<Typography key={i} variant="body2">
				{part}
			</Typography>
		);
	});
};
