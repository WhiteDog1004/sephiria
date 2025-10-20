import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, Box, Button, Column, Row } from "@/src/shared";
import { Typography } from "@/src/shared/ui/typography";

export const Footer = () => {
	return (
		<Column className="gap-4 items-center">
			<Typography variant="body2" className="text-gray-500 text-center">
				All copyrights belong to TEAM HORAY.
				<br />
				This is an unofficial fansite.
			</Typography>

			<Row className="items-center gap-4">
				<Link target="_blank" href={"https://discord.com/invite/g7AaeBuyMV"}>
					<Box className="p-2 bg-[#23272ac7] text-white w-max rounded-lg">
						<Image
							src={"/discord-icon.svg"}
							width={32}
							height={32}
							alt={"discord"}
						/>
					</Box>
				</Link>
				<Link
					target="_blank"
					href={"https://discord.com/users/313963147432034306"}
				>
					<Button className="h-10">
						<Row className="items-center gap-2">
							<Avatar className="w-6 h-6">
								<AvatarImage src="https://cdn.discordapp.com/avatars/313963147432034306/a_6aa450a5db03c7b0d19c0e76ed0f76bf.gif" />
							</Avatar>
							<Typography variant="body2">문의하기</Typography>
						</Row>
					</Button>
				</Link>
			</Row>
		</Column>
	);
};
