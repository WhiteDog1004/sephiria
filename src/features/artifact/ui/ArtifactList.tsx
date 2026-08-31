import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ArtifactProps } from "@/src/modules/artifact/model/types";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import {
	getRarityValue,
	type Rarity,
} from "../../simulator/lib/getRarityOrder";
import { ArtifactDetailDialog } from "./ArtifactDetailDialog";

const optionTransition = { duration: 0.18, ease: "easeOut" } as const;
const MAX_ANIMATED_ARTIFACTS = 80;

export const ArtifactList = ({ data, animateResults }: ArtifactProps) => {
	const { theme } = useTheme();

	const [mounted, setMounted] = useState(false);
	const resultData = data.filter((item) => !item.disabled);
	const shouldAnimateResults =
		Boolean(animateResults) && resultData.length <= MAX_ANIMATED_ARTIFACTS;

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<Box
			className={`grid max-w-3xl h-full p-4 rounded-lg ${clsx(resultData.length > 0 ? "grid-cols-[repeat(auto-fill,minmax(80px,1fr))]" : "grid-cols-1", theme === "light" ? "bg-gray-200" : "bg-[#40273b]")}`}
		>
			{resultData.length > 0 ? (
				shouldAnimateResults ? (
					<AnimatePresence mode="popLayout">
						{[...resultData]
							.sort(
								(a, b) =>
									getRarityValue(a.tier as Rarity) -
									getRarityValue(b.tier as Rarity),
							)
							.map((item) => (
								<motion.div
									key={item.value}
									layout
									initial={{ opacity: 0, scale: 0.96, y: 6 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.92, y: -6 }}
									transition={optionTransition}
								>
									<ArtifactDetailDialog item={item} />
								</motion.div>
							))}
					</AnimatePresence>
				) : (
					[...resultData]
						.sort(
							(a, b) =>
								getRarityValue(a.tier as Rarity) -
								getRarityValue(b.tier as Rarity),
						)
						.map((item) => (
							<div key={item.value}>
								<ArtifactDetailDialog item={item} />
							</div>
						))
				)
			) : (
				<Box className="w-full p-0">
					<Typography className="opacity-70">검색 결과가 없습니다</Typography>
				</Box>
			)}
		</Box>
	);
};
