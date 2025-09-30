import Image from "next/image";
import { SectionHeader } from "@/src/shared/components/section-header";
import { COSTUMES, type CostumeDataType } from "@/src/shared/config/costumes";
import { containsRedKeyword } from "@/src/shared/model/containsWords";
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
		<Box className="flex-col items-center gap-4 p-0">
			<SectionHeader
				title={"코스튬"}
				description={"자신에게 맞는 코스튬을 찾아보세요!"}
			/>
			<Box className="grid grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))]  md:grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-4 max-w-5xl w-full p-0">
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

						<Box className="flex-col justify-start aspect-square gap-4 p-0">
							<Typography>{COSTUMES[costume.value].name}</Typography>
							<Typography
								variant="caption"
								className="whitespace-pre-line opacity-50"
							>
								{COSTUMES[costume.value].unlock ?? "기본 코스튬"}
							</Typography>
							<Box className="py-2 px-4 border rounded-md h-[50]">
								<Tooltip>
									<TooltipTrigger>
										<Typography
											variant="caption"
											className="line-clamp-2 opacity-60"
										>
											{COSTUMES[costume.value].story}
										</Typography>
									</TooltipTrigger>
									<TooltipContent className="max-w-40 p-2 rounded-sm bg-gray-800 text-white text-center">
										<Typography
											variant="caption"
											className="whitespace-pre-line"
										>
											{COSTUMES[costume.value].story}
										</Typography>
									</TooltipContent>
								</Tooltip>
							</Box>

							<Box className="flex-col p-0">
								{COSTUMES[costume.value].options.map((item) => (
									<Typography
										key={costume.id + item}
										variant="caption"
										className={
											containsRedKeyword(item)
												? "text-red-500"
												: "text-green-500"
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
		</Box>
	);
};
