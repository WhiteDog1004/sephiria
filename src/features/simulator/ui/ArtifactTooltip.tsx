import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { getItemsTierColor } from "@/src/features/simulator/lib/getItemsTierColor";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import { EFFECT_LABELS } from "../config/constants";
import FormattedEffectContent from "../lib/formattedEffectContent";
import { renderStar } from "../lib/renderStar";

export const ArtifactTooltip = ({
	data,
}: {
	data: ArtifactInstance["item"];
}) => {
	const { theme } = useTheme();

	return (
		<Box
			key={data.value}
			className={`relative flex flex-col gap-3 max-w-3xs p-4 text-center rounded-md bg-gray-800 border border-gray-700 text-white`}
		>
			<Typography
				className={`absolute -top-3 left-1/2 -translate-x-1/2 ${clsx(theme === "dark" ? "text-yellow-300" : "px-2 bg-gray-500 rounded-md text-yellow-300")}`}
				variant="body2"
			>
				{renderStar(data.level || 0)}
			</Typography>
			<Box className="w-max p-0">
				<Box className={`flex flex-col p-0`}>
					<Typography
						className={`${getItemsTierColor(data.tier)}`}
						variant="body2"
					>
						{data.label_kor}
					</Typography>
					<Box className="p-0 gap-1">
						{data.effect.sets?.map((set) => (
							<Typography
								className={`text-green-300`}
								variant="caption"
								key={set}
							>
								#{EFFECT_LABELS[set]}
							</Typography>
						))}
					</Box>
				</Box>
				<Image width={80} height={80} src={data.image} alt={data.label_eng} />
			</Box>
			<Typography
				className="w-full whitespace-pre-line text-gray-400"
				variant="caption"
			>
				{data.description}
			</Typography>
			<Box className="p-0">
				<FormattedEffectContent content={data.effect.content} />
			</Box>
		</Box>
	);
};
