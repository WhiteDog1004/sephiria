import Image from "next/image";
import Link from "next/link";
import { Column, Row, SITEMAP } from "@/src/shared";
import { Typography } from "@/src/shared/ui/typography";
import { DeveloperContactDialog } from "./DeveloperContactDialog";
import { SupportersDialogButton } from "./SupportersDialogButton";

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
				<DeveloperContactDialog />
				<SupportersDialogButton />
			</Row>

			<Row className="items-center gap-3 text-gray-500">
				<Link href={SITEMAP.TERMS} className="hover:text-foreground">
					<Typography variant="body2">이용약관</Typography>
				</Link>
				<span
					aria-hidden
					className="size-1 rounded-full bg-gray-500 shrink-0"
				/>
				<Link href={SITEMAP.PRIVACY} className="hover:text-foreground">
					<Typography variant="body2">개인정보처리방침</Typography>
				</Link>
			</Row>
		</Column>
	);
};
