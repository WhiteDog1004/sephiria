import Image from "next/image";
import { getCostumeOptions } from "@/src/shared/model/constants";
import { containsRedKeyword } from "@/src/shared/model/containsWords";
import type { CostumeDataType } from "@/src/shared/types/types";
import { Box } from "@/src/shared/ui/box";
import { Card } from "@/src/shared/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/shared/ui/tooltip";
import { Typography } from "@/src/shared/ui/typography";

export const CostumeList = ({ data }: { data: CostumeDataType }) => {
	return (
		<Box className="grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-4 max-w-7xl w-full p-0">
			{data.map((costume) => (
				<Card key={costume.id} className="w-full h-auto items-center p-4">
					<Image
						className="w-max min-h-full p-0 h-[78]"
						width={48}
						height={72}
						src={costume.image || ""}
						alt={costume.value}
						unoptimized
					/>

					<Box className="flex-col justify-start aspect-square gap-2 p-0">
						<Typography>{getCostumeOptions[costume.value].name}</Typography>
						<Typography
							variant="body2"
							className="whitespace-pre-line opacity-50"
						>
							{getCostumeOptions[costume.value].unlock ?? "기본 코스튬"}
						</Typography>
						<Box className="py-2 px-4 border rounded-md h-[50]">
							<Tooltip>
								<TooltipTrigger>
									<Typography
										variant="caption"
										className="line-clamp-2 opacity-60"
									>
										{getCostumeOptions[costume.value].story}
									</Typography>
								</TooltipTrigger>
								<TooltipContent className="max-w-40 text-center">
									<Typography variant="caption" className="whitespace-pre-line">
										{getCostumeOptions[costume.value].story}
									</Typography>
								</TooltipContent>
							</Tooltip>
						</Box>

						<Box className="flex-col p-0">
							{getCostumeOptions[costume.value].options.map((item) => (
								<Typography
									key={costume.id + item}
									variant="body2"
									className={
										containsRedKeyword(item) ? "text-red-500" : "text-green-500"
									}
								>
									{item}
								</Typography>
							))}
						</Box>
					</Box>
				</Card>
			))}
		</Box>
	);
};
