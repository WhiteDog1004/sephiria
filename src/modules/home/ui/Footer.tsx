import Image from "next/image";
import Link from "next/link";
import { Box, Column } from "@/src/shared";
import { Typography } from "@/src/shared/ui/typography";

export const Footer = () => {
	return (
		<Column className="gap-4 items-center">
			<Typography variant="body2" className="text-gray-500 text-center">
				All copyrights belong to TEAM HORAY.
				<br />
				This is an unofficial fansite.
			</Typography>

			<Link href={"https://discord.com/invite/g7AaeBuyMV"}>
				<Box className="p-2 bg-[#23272ac7] text-white w-max rounded-lg">
					<Image
						src={"/discord-icon.svg"}
						width={32}
						height={32}
						alt={"discord"}
					/>
				</Box>
			</Link>
		</Column>
	);
};
