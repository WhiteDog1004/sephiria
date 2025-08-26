import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { highlightNumbers } from "@/src/entities/miracle/lib/highlightNumbers";
import type { MiracleOptions } from "@/src/entities/miracle/model/types";
import { Box } from "@/src/shared/ui/box";
import { Separator } from "@/src/shared/ui/separator";
import { Typography } from "@/src/shared/ui/typography";

export const MiracleList = ({ data }: MiracleOptions) => {
	const { theme } = useTheme();

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;
	return (
		<Box
			className={`flex-col justify-start gap-4 max-w-xl h-full p-4 rounded-lg ${clsx(theme === "light" ? "bg-gray-200" : "bg-[#40273b]")}`}
		>
			{data.length > 0 ? (
				data.map((item) => (
					<Box
						key={item.id}
						className="gap-2 flex-col md:flex-row py-2 px-4 border-2 rounded-lg"
					>
						<Box className="flex-col w-max min-w-32 gap-2 p-2">
							<Image
								width={60}
								height={60}
								src={item.image || ""}
								alt={item.value}
							/>
							<Separator />
							<Typography>{item.value_kor}</Typography>
						</Box>
						<Box className="flex-col gap-1 p-2">
							{item.effects.reward?.map((reward) => (
								<Box key={reward} className="gap-1 p-0">
									{highlightNumbers(reward, false)}
								</Box>
							))}
							{item.effects.penalty?.map((penalty) => (
								<Box key={penalty} className="gap-1 p-0">
									{highlightNumbers(penalty, true)}
								</Box>
							))}
						</Box>
					</Box>
				))
			) : (
				<Box className="w-full p-0">
					<Typography className="opacity-70">검색 결과가 없습니다</Typography>
				</Box>
			)}
		</Box>
	);
};
