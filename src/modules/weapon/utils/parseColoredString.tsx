import { Typography } from "@/src/shared";
import { colorMap } from "./colorMap";

export const parseColoredString = (str: string): React.ReactNode[] => {
	const regex = /\$(\w)([^$]+)\$/g;
	const result: React.ReactNode[] = [];
	let lastIndex = 0;

	let match: RegExpExecArray | null = regex.exec(str);
	while (match !== null) {
		if (match.index > lastIndex) {
			result.push(str.slice(lastIndex, match.index));
		}

		const [full, key, text] = match;
		const colorClass = colorMap[`$${key}`] || "text-black";

		result.push(
			<Typography
				variant="body2"
				key={match.index}
				className={colorClass}
				asChild
			>
				<span>{text}</span>
			</Typography>,
		);

		lastIndex = match.index + full.length;
		match = regex.exec(str);
	}

	if (lastIndex < str.length) {
		result.push(str.slice(lastIndex));
	}

	return result;
};
