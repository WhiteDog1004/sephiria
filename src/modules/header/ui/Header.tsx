"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, Button, Row, Typography } from "@/src/shared";
import { SITEMAP } from "@/src/shared/config/sitemap";
import { Box } from "@/src/shared/ui/box";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { MENU_LIST } from "../model/constants";
import {
	discordLoginHandler,
	discordLogoutHandler,
} from "../model/discordLoginHelper";
import { useSession } from "../model/useUserInfo";
import { ModeToggle } from "./ModeToggle";

export const Header = () => {
	const router = useRouter();
	const { data } = useSession();

	return (
		<Box className="sticky z-50 top-0 backdrop-blur-md border-b dark:border-white/10 border-black/10 p-4">
			<Box className="justify-between max-w-5xl p-0">
				<Box
					className="w-max p-0 cursor-pointer"
					onClick={() => router.push(SITEMAP.HOME)}
				>
					<Image width={120} height={100} src={"/sephiria.webp"} alt={"logo"} />
				</Box>
				<Box className="w-max p-0 gap-3">
					<ModeToggle />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button type="button" className="w-9">
								<Menu />
							</Button>
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							{data ? (
								<Row className="gap-2 items-center cursor-pointer">
									<Typography variant="body2">
										{data.user.user_metadata.full_name}
									</Typography>
									<Avatar>
										<AvatarImage src={data.user?.user_metadata.avatar_url} />
									</Avatar>
								</Row>
							) : (
								<Avatar className="border">
									<Box className="p-0 justify-center items-center cursor-pointer">
										<Typography>?</Typography>
									</Box>
								</Avatar>
							)}
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-24" align="end">
							<DropdownMenuGroup>
								{data ? (
									<DropdownMenuItem onClick={discordLogoutHandler}>
										<Image
											src={"/discord-icon.svg"}
											width={20}
											height={20}
											alt={"discord"}
											className="invert dark:invert-0"
										/>
										로그아웃
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem onClick={discordLoginHandler}>
										<Image
											src={"/discord-icon.svg"}
											width={20}
											height={20}
											alt={"discord"}
											className="invert dark:invert-0"
										/>
										로그인
									</DropdownMenuItem>
								)}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</Box>
			</Box>
		</Box>
	);
};
