import Image from "next/image";
import Link from "next/link";
import { CostumeCarousel } from "@/src/entities/costume/ui/Carousel";
import { SITEMAP } from "@/src/shared/lib/sitemap";
import { Box } from "@/src/shared/ui/box";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { Separator } from "@/src/shared/ui/separator";
import { Typography } from "@/src/shared/ui/typography";
import type { Database } from "@/types_db";

export const ShortcutBox = ({
	data,
}: {
	data: Database["public"]["Tables"]["costume"]["Row"][];
}) => {
	if (!data) return;
	return (
		<Box className="grid grid-cols-2 gap-4 max-w-3xl w-full p-0">
			<Card className="w-max py-0 row-span-3 overflow-hidden">
				<Box className="flex-col p-0">
					<Image
						width={360}
						height={180}
						src={"/inventory.png"}
						alt={"simulator"}
					/>
					<Box className="flex-col gap-2 p-4">
						<Typography variant="header3">인벤토리 시뮬레이터</Typography>
						<Typography variant="body2" className="text-gray-500">
							웹에서 석판과 아티팩트를 시뮬레이션해볼 수 있어요!
						</Typography>
						<Box className="w-full justify-end p-0">
							<Link href={SITEMAP.SIMULATOR}>
								<Button>바로가기</Button>
							</Link>
						</Box>
					</Box>
				</Box>
			</Card>
			<Card className="w-full py-0 row-span-3 overflow-hidden">
				<Box className="flex-col px-0 py-4">
					<CostumeCarousel data={data ?? []} />
					<Separator className="mt-4" />
					<Box className="gap-2 p-4">
						<Box className="flex-col w-full p-0">
							<Typography variant="header3">코스튬</Typography>
							<Typography variant="body2" className="text-gray-500">
								수많은 코스튬들을 확인해 보세요!
							</Typography>
						</Box>
						<Box className="w-max justify-end p-0">
							<Link href={SITEMAP.SIMULATOR}>
								<Button>바로가기</Button>
							</Link>
						</Box>
					</Box>
				</Box>
			</Card>
		</Box>
	);
};
