import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ArtifactProps } from "@/src/modules/artifact/model/types";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import {
	getRarityValue,
	type Rarity,
} from "../../simulator/lib/getRarityOrder";
import { ItemSource } from "../../simulator/ui/ItemSource";

export const ArtifactList = ({ data }: ArtifactProps) => {
	const { theme } = useTheme();

	const [mounted, setMounted] = useState(false);
	const resultData = data.filter((item) => !item.disabled);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;
	return (
		<Box
			className={`grid max-w-3xl h-full p-4 rounded-lg ${clsx(resultData.length > 0 ? "grid-cols-[repeat(auto-fill,minmax(80px,1fr))]" : "grid-cols-1", theme === "light" ? "bg-gray-200" : "bg-[#40273b]")}`}
		>
			{resultData.length > 0 ? (
				resultData
					.sort(
						(a, b) =>
							getRarityValue(a.tier as Rarity) -
							getRarityValue(b.tier as Rarity),
					)
					.map((item) => (
						<ItemSource
							key={item.value}
							isPreview
							item={{
								id: item.value,
								label: item.label_kor,
								type: "artifact",
								data: item,
								image: item.image,
							}}
						/>
					))
			) : (
				<Box className="w-full p-0">
					<Typography className="opacity-70">검색 결과가 없습니다</Typography>
				</Box>
			)}
		</Box>
	);
};
