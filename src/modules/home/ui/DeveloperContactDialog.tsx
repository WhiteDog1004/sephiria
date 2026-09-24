"use client";

import { Copy } from "lucide-react";
import {
	Avatar,
	AvatarImage,
	Button,
	copyToClipboard,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Row,
	Typography,
} from "@/src/shared";

const DISCORD_USERNAME = "whitedog";

export const DeveloperContactDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-10 w-full sm:w-[185px]">
					<Row className="items-center gap-2">
						<Avatar className="w-6 h-6">
							<AvatarImage src="https://cdn.discordapp.com/avatars/313963147432034306/a_6aa450a5db03c7b0d19c0e76ed0f76bf.gif" />
						</Avatar>
						<Typography variant="body2">개발자 문의하기</Typography>
					</Row>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>개발자 문의하기</DialogTitle>
					<DialogDescription>
						Discord 친구 추가에서
						<br />
						사용자명을 검색해 주세요.
					</DialogDescription>
				</DialogHeader>
				<Row className="w-full items-center justify-between gap-3 rounded-md border bg-secondary/40 p-3">
					<Typography className="font-mono select-all" variant="body2">
						{DISCORD_USERNAME}
					</Typography>
					<Button
						type="button"
						variant="secondary"
						className="shrink-0"
						onClick={() => copyToClipboard(DISCORD_USERNAME)}
					>
						<Copy className="size-4" />
						복사
					</Button>
				</Row>
			</DialogContent>
		</Dialog>
	);
};
