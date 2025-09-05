import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import { ITEM_SLABS_DATA } from "../../simulator/config/slabsLists";
import {
	getRarityValue,
	type Rarity,
} from "../../simulator/lib/getRarityOrder";
import { ItemSource } from "../../simulator/ui/ItemSource";

export const LargeList = () => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const filteredItems = ITEM_SLABS_DATA.sort(
		(a, b) =>
			getRarityValue(a.tier as Rarity) - getRarityValue(b.tier as Rarity),
	).filter((item) => {
		const matchesSearch = item.ko_label.toLowerCase();
		return matchesSearch;
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;
	return (
		<Box
			className={`grid max-w-3xl h-full p-4 rounded-lg ${clsx(filteredItems.length > 0 ? "grid-cols-[repeat(auto-fill,minmax(80px,1fr))]" : "grid-cols-1", theme === "light" ? "bg-gray-200" : "bg-[#40273b]")}`}
		>
			{filteredItems.length > 0 ? (
				filteredItems.map((item) => (
					<ItemSource
						key={item.value}
						isPreview
						item={{
							type: "slabs",
							id: item.value,
							label: item.ko_label,
							...(item.rotate && { rotation: 0 }),
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
