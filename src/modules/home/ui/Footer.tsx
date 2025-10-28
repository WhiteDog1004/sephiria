import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, Button, Column, Row } from "@/src/shared";
import { Typography } from "@/src/shared/ui/typography";

export const Footer = () => {
	return (
		<Column className="gap-4 items-center">
			<Typography variant="body2" className="text-gray-500 text-center">
				All copyrights belong to TEAM HORAY.
				<br />
				This is an unofficial fansite.
			</Typography>

			<Row className="flex-col sm:flex-row items-center gap-4">
				<Link target="_blank" href={"https://discord.com/invite/g7AaeBuyMV"}>
					<Row className="items-center gap-2 py-2 px-4 bg-[#7289da] text-white w-max rounded-sm">
						<Image
							src={"/discord-icon.svg"}
							width={24}
							height={24}
							alt={"discord"}
						/>
						<Typography variant="body2">세피리아 디스코드</Typography>
					</Row>
				</Link>
				<Link
					target="_blank"
					href={"https://discord.com/users/313963147432034306"}
					className="w-full"
				>
					<Button className="w-full h-10">
						<Row className="items-center gap-2">
							<Avatar className="w-6 h-6">
								<AvatarImage src="https://cdn.discordapp.com/avatars/313963147432034306/a_6aa450a5db03c7b0d19c0e76ed0f76bf.gif" />
							</Avatar>
							<Typography variant="body2">개발자 문의하기</Typography>
						</Row>
					</Button>
				</Link>
			</Row>
		</Column>
	);
};
