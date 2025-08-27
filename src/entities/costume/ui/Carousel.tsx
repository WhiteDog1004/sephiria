import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { getCostumeOptions } from "@/src/features/costume/model/constants";
import { Box } from "@/src/shared/ui/box";
import {
	Carousel,
	CarouselContent,
	CarouselItem
} from "@/src/shared/ui/carousel";
import { Typography } from "@/src/shared/ui/typography";
import type { Database } from "@/types_db";

export const CostumeCarousel = ({
	data,
}: {
	data: Database["public"]["Tables"]["costume"]["Row"][];
}) => {
	return (
		<Carousel
			opts={{
				slidesToScroll: "auto",
			}}
			plugins={[
				Autoplay({
					delay: 2000,
				}),
			]}
			className="w-full px-3"
		>
			<CarouselContent className="-ml-1">
				{data.map((item, index) => (
					<CarouselItem
						key={index}
						className="flex justify-center items-center pl-1 basis-1/2 md:basis-1/3"
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
							<Typography variant="caption">
								{getCostumeOptions[item.value].name}
							</Typography>
						</Box>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};
