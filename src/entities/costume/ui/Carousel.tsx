import { getCostumeOptions } from "@/src/shared/model/constants";
import { Box } from "@/src/shared/ui/box";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/src/shared/ui/carousel";
import { Typography } from "@/src/shared/ui/typography";
import { Database } from "@/types_db";
import Image from "next/image";

export const CostumeCarousel = ({
	data,
}: {
	data: Database["public"]["Tables"]["costume"]["Row"][];
}) => {
	return (
		<Carousel className="w-full">
			<CarouselContent className="-ml-1">
				{data.map((item, index) => (
					<CarouselItem
						key={index}
						className="flex justify-center items-center pl-1 md:basis-1/4 lg:basis-1/6"
					>
						<Box className="flex flex-col p-0 gap-4">
							<Image
								className="w-max min-h-full p-0 h-[78]"
								width={48}
								height={72}
								src={item.image || ""}
								alt={item.value}
								unoptimized
							/>
							<Typography>
								{getCostumeOptions[item.value].name}
							</Typography>
						</Box>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};
