"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Column, Typography } from "../shared";

const NotFound = () => {
	const router = useRouter();
	return (
		<Column className="gap-4 justify-center items-center w-full h-screen">
			<Column className="gap-8 items-center">
				<Image src="/white-wolf.png" alt="notFound" width={170} height={170} />
				<Typography variant="header1" color="textSecondary">
					페이지를 찾을 수 없습니다
				</Typography>
			</Column>
			<Button onClick={() => router.back()} className="flex items-center gap-2">
				<ChevronLeft />
				<Typography>뒤로가기</Typography>
			</Button>
		</Column>
	);
};

export default NotFound;
