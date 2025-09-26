"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { discordLoginHandler } from "@/src/modules/header/model/discordLoginHelper";
import { Button } from "../ui/button";
import { Column } from "../ui/column";
import { Typography } from "../ui/typography";

const NotLogin = () => {
	const router = useRouter();
	return (
		<Column className="gap-4 justify-center items-center w-full h-screen">
			<Column className="gap-8 items-center">
				<Image src="/white-wolf.png" alt="notFound" width={170} height={170} />
				<Typography variant="header1" color="textSecondary">
					이곳은 로그인이 필요해요!
				</Typography>
			</Column>
			<Column className="gap-4 max-w-max">
				<Button onClick={discordLoginHandler}>
					<Image
						src={"/discord-icon.svg"}
						width={20}
						height={20}
						alt={"discord"}
						className="invert dark:invert-0"
					/>
					디스코드 로그인
				</Button>
				<Button
					onClick={() => router.back()}
					className="flex items-center gap-2"
				>
					<ChevronLeft />
					<Typography>돌아가기</Typography>
				</Button>
			</Column>
		</Column>
	);
};

export default NotLogin;
