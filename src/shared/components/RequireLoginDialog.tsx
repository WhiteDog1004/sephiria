"use client";

import Image from "next/image";
import { discordLoginHandler } from "@/src/modules/header/model/discordLoginHelper";
import { Button } from "../ui/button";
import { Column } from "../ui/column";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Typography } from "../ui/typography";

type RequireLoginDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	actionText: string;
};

export const RequireLoginDialog = ({
	open,
	onOpenChange,
	actionText,
}: RequireLoginDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="hidden">로그인이 필요해요</DialogTitle>
					<DialogDescription asChild>
						<Column className="justify-center items-center gap-4">
							<Image src="/white-wolf.png" alt="needLogin" width={80} height={80} />
							<Typography className="text-center" variant="body2">
								앗 잠깐만요!
								<br />
								{actionText}
								<br />
								<b className="text-blue-600">디스코드 로그인</b>이 필요해요!
							</Typography>
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
						</Column>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
