import { parseColoredString } from "@/src/shared/utils/parseColoredString";

const parseLines = (text: string) =>
	text.split("\n").map((line) => {
		if (line.startsWith("## ")) {
			return { type: "heading" as const, text: line.slice(3) };
		}
		if (line.startsWith("- ")) {
			return { type: "item" as const, text: line.slice(2) };
		}
		return { type: "text" as const, text: line };
	});

export const WeaponEffectText = ({ text }: { text: string }) => {
	const lines = parseLines(text);
	const hasSections = lines.some((line) => line.type === "heading");

	if (!hasSections) {
		return <>{parseColoredString(text)}</>;
	}

	const intro: string[] = [];
	const sections: { heading: string; items: string[] }[] = [];
	let currentSection: { heading: string; items: string[] } | undefined;

	for (const line of lines) {
		if (line.type === "heading") {
			currentSection = { heading: line.text, items: [] };
			sections.push(currentSection);
		} else if (line.type === "item" && currentSection) {
			currentSection.items.push(line.text);
		} else if (line.text.trim()) {
			intro.push(line.text);
		}
	}

	return (
		<div className="space-y-2">
			{intro.length > 0 && (
				<p className="leading-snug">{parseColoredString(intro.join(" "))}</p>
			)}
			{sections.map((section) => (
				<div
					key={section.heading}
					className="rounded-md border border-[#55566d] bg-[#252532] px-2.5 py-1.5 font-mono text-xs leading-snug"
				>
					<div className="mb-1 font-semibold text-cyan-300">
						{parseColoredString(section.heading)}
					</div>
					<div className="space-y-0.5 text-foreground/90">
						{section.items.map((item, index) => (
							<div key={`${section.heading}-${index}`} className="flex gap-1.5">
								<span aria-hidden="true" className="text-cyan-300">•</span>
								<span>{parseColoredString(item)}</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
