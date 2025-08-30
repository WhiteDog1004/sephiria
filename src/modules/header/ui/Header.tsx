"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SITEMAP } from "@/src/shared/lib/sitemap";
import { Box } from "@/src/shared/ui/box";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { MENU_LIST } from "../model/constants";
import { ModeToggle } from "./ModeToggle";

export const Header = () => {
	const router = useRouter();

	return (
		<Box className="sticky z-50 top-0 backdrop-blur-md border-b dark:border-white/10 border-black/10">
			<Box className="justify-between max-w-7xl p-0">
				<Box
					className="w-max p-0 cursor-pointer"
					onClick={() => router.push(SITEMAP.HOME)}
				>
					<Image width={120} height={100} src={"/sephiria.webp"} alt={"logo"} />
				</Box>
				<Box className="w-max p-0 gap-4">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Menu />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-24" align="end">
							<DropdownMenuGroup>
								{MENU_LIST.map((list) => (
									<DropdownMenuItem
										key={list.label}
										onClick={() => router.push(list.link)}
									>
										{list.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</Box>
			</Box>
		</Box>
	);
};
