"use client";

import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Row,
	Typography,
} from "@/src/shared";

const supporters = [
	{
		nickname: "이*헌",
		costume: "https://img.sephiria.wiki/costume/frog.png",
	},
	{
		nickname: "이*재",
		costume: "https://img.sephiria.wiki/costume/wizard_rabbit.png",
	},
	{
		nickname: "pjh815",
		costume: "https://img.sephiria.wiki/costume/white_wolf.png",
	},
	{
		nickname: "ㅇ크라이ㅇ",
		costume: "https://img.sephiria.wiki/costume/pink_rabbit.png",
	},
	{
		nickname: "세갤러",
		costume: "https://img.sephiria.wiki/costume/rabbit.png",
	},
	{
		nickname: "38올컬랙을향하여",
		costume: "https://img.sephiria.wiki/costume/braid.png",
	},
];

const SUPPORTERS_PER_PAGE = 6;

export const SupportersDialogButton = () => {
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(0);
	const pageCount = Math.ceil(supporters.length / SUPPORTERS_PER_PAGE);
	const hasPagination = pageCount > 1;
	const visibleSupporters = supporters.slice(
		page * SUPPORTERS_PER_PAGE,
		(page + 1) * SUPPORTERS_PER_PAGE,
	);

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);

		if (!nextOpen) {
			setPage(0);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="h-10 w-full border-amber-300 bg-amber-100/20 text-amber-500 hover:bg-amber-100/30 dark:border-amber-300/50 dark:bg-amber-200/20 dark:text-amber-300 dark:hover:bg-amber-200/30 sm:w-[185px]">
					<Row className="items-center gap-2">
						<Crown className="size-5 fill-amber-400 text-amber-600" />
						<Typography variant="body2">후원자 목록</Typography>
					</Row>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>후원자 목록</DialogTitle>
					<DialogDescription className="text-sm leading-relaxed">
						세피리아 위키를 후원해주신 모든 분들께 진심으로 감사드립니다.
					</DialogDescription>
				</DialogHeader>
				<div className="grid min-h-[564px] auto-rows-[84px] grid-cols-1 content-start gap-3 overflow-y-auto pr-1 sm:min-h-[276px] sm:grid-cols-2">
					{visibleSupporters.map((supporter) => (
						<div
							key={supporter.nickname}
							className="flex h-[84px] items-center gap-3 rounded-md border bg-amber-50/70 p-3 dark:bg-amber-100/10"
						>
							<div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-transparent">
								<Image
									src={supporter.costume}
									alt={supporter.nickname}
									width={48}
									height={48}
									className="size-10 object-contain"
									unoptimized
								/>
							</div>
							<Typography variant="body2" className="break-all">
								{supporter.nickname}
							</Typography>
						</div>
					))}
				</div>
				{hasPagination && (
					<div className="flex shrink-0 items-center justify-center gap-2 border-t pt-4">
						<Button
							type="button"
							size="icon"
							variant="outline"
							className="size-8"
							disabled={page === 0}
							onClick={() => setPage((current) => Math.max(current - 1, 0))}
						>
							<ChevronLeft className="size-4" />
							<span className="sr-only">이전 페이지</span>
						</Button>
						{Array.from({ length: pageCount }, (_, index) => (
							<Button
								key={index}
								type="button"
								size="icon"
								variant={page === index ? "default" : "outline"}
								className="size-8"
								onClick={() => setPage(index)}
							>
								{index + 1}
							</Button>
						))}
						<Button
							type="button"
							size="icon"
							variant="outline"
							className="size-8"
							disabled={page === pageCount - 1}
							onClick={() =>
								setPage((current) => Math.min(current + 1, pageCount - 1))
							}
						>
							<ChevronRight className="size-4" />
							<span className="sr-only">다음 페이지</span>
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
