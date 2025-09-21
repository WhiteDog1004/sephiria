import Image from "next/image";
import Link from "next/link";
import { CostumeCarousel } from "@/src/entities/costume/ui/Carousel";
import { SITEMAP } from "@/src/shared/config/sitemap";
import { Box } from "@/src/shared/ui/box";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { Separator } from "@/src/shared/ui/separator";
import { Typography } from "@/src/shared/ui/typography";
import type { Database } from "@/types_db";
import { menuItems } from "../config/menuItems";

export const ShortcutBox = ({
	data,
}: {
	data: Database["public"]["Tables"]["costume"]["Row"][];
}) => {
	if (!data) return;
	return (
		<Box className="flex-col md:flex-row gap-4 max-w-lg md:max-w-3xl w-full p-0">
			<Card
				className="w-full py-0 row-span-3 overflow-hidden"
				style={{ height: "-webkit-fill-available" }}
			>
				<Box className="flex-col h-full p-0">
					<Image
						width={360}
						height={180}
						src={"/inventory.png"}
						alt={"simulator"}
						className="w-full object-cover"
						unoptimized
					/>
					<Box className="flex-col h-full gap-2 p-4">
						<Typography variant="header3">인벤토리 시뮬레이터</Typography>
						<Typography variant="body2" className="text-gray-500">
							웹에서 게임처럼 시뮬레이션해볼 수 있어요!
						</Typography>
						<Box className="w-full justify-end p-0">
							<Link href={SITEMAP.SIMULATOR}>
								<Button>바로가기</Button>
							</Link>
						</Box>
					</Box>
				</Box>
			</Card>
			<Box className="flex-col gap-4 p-0">
				<Card className="w-full py-0 overflow-hidden">
					<Box className="flex-col p-0 pt-4">
						<CostumeCarousel data={data ?? []} />
						<Separator className="mt-4" />
						<Box className="gap-2 p-4">
							<Box className="flex-col w-full p-0">
								<Typography variant="header3">코스튬</Typography>
								<Typography variant="body2" className="text-gray-500">
									코스튬들의 능력을 확인해 보세요!
								</Typography>
							</Box>
							<Box className="w-max justify-end p-0">
								<Link href={SITEMAP.COSTUME}>
									<Button>바로가기</Button>
								</Link>
							</Box>
						</Box>
					</Box>
				</Card>
				<Card className="w-full py-0 row-span-1 overflow-hidden">
					<Box className="flex-col p-0">
						<Box className="gap-2 p-4">
							{menuItems.map((item) => (
								<Link key={item.href} href={item.href} className="w-full">
									<Box className="flex-col gap-2 w-full p-0">
										<Image
											width={48}
											height={48}
											src={item.src}
											alt={item.alt}
											unoptimized
										/>
										<Typography>{item.label}</Typography>
									</Box>
								</Link>
							))}
						</Box>
						<Separator />
						<Box className="py-4">
							<Typography variant="body2" className="text-gray-500">
								다양한 아이템들을 확인해 보세요!
							</Typography>
						</Box>
					</Box>
				</Card>
			</Box>
		</Box>
	);
};
