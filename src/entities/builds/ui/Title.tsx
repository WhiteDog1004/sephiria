"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";

export const Title = ({
	title,
	combo,
}: {
	title: string;
	combo?: string[];
}) => {
	const titleRef = useRef<HTMLDivElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const [isOpenTitleTooltip, setIsOpenTitleTooltip] = useState(false);
	const [isOpenTitlePopover, setIsOpenTitlePopover] = useState(false);
	const [openComboPopoverKey, setOpenComboPopoverKey] = useState<string | null>(
		null,
	);
	const [canHover, setCanHover] = useState(false);

	useEffect(() => {
		const checkTruncation = () => {
			const el = titleRef.current;
			if (!el) return;
			setIsTruncated(el.scrollWidth > el.clientWidth);
		};

		checkTruncation();
		window.addEventListener("resize", checkTruncation);
		return () => window.removeEventListener("resize", checkTruncation);
	}, []);

	useEffect(() => {
		setCanHover(window.matchMedia("(hover: hover)").matches);
	}, []);

	useEffect(() => {
		if (!isTruncated) {
			setIsOpenTitleTooltip(false);
			setIsOpenTitlePopover(false);
		}
	}, [isTruncated]);

	return (
		<Row className="w-full border rounded-md p-2 bg-gray-200 dark:bg-gray-800">
			<Row className="mx-auto max-w-full min-w-0 items-center gap-2">
				{combo && combo.length > 0 && (
					<Row className="items-center gap-0 shrink-0">
						{combo.map((key) =>
							canHover ? (
								<Tooltip key={key} delayDuration={300}>
									<TooltipTrigger asChild>
										<Row className="p-0">
											<Image
												width={20}
												height={20}
												unoptimized
												src={`/combo/${key}.png`}
												alt={key}
											/>
										</Row>
									</TooltipTrigger>
									<TooltipContent sideOffset={8}>
										<Typography variant="caption" className="px-2 py-1">
											{EFFECT_LABELS[key] || key}
										</Typography>
									</TooltipContent>
								</Tooltip>
							) : (
								<Popover
									key={key}
									open={openComboPopoverKey === key}
									onOpenChange={(nextOpen) => {
										setOpenComboPopoverKey(nextOpen ? key : null);
									}}
								>
									<PopoverTrigger asChild>
										<Row className="p-0">
											<Image
												width={20}
												height={20}
												unoptimized
												src={`/combo/${key}.png`}
												alt={key}
											/>
										</Row>
									</PopoverTrigger>
									<PopoverContent sideOffset={8} className="w-max max-w-52 p-0">
										<Typography variant="caption" className="px-2 py-1">
											{EFFECT_LABELS[key] || key}
										</Typography>
									</PopoverContent>
								</Popover>
							),
						)}
					</Row>
				)}
				{canHover ? (
					<Tooltip open={isOpenTitleTooltip}>
						<TooltipTrigger asChild>
							<Row
								className="min-w-0 justify-center"
								onMouseEnter={() => {
									if (isTruncated) {
										setIsOpenTitleTooltip(true);
									}
								}}
								onMouseLeave={() => {
									setIsOpenTitleTooltip(false);
								}}
							>
								<Typography
									ref={titleRef}
									variant="body2"
									className="w-full truncate text-center"
								>
									{title}
								</Typography>
							</Row>
						</TooltipTrigger>
						{isTruncated && (
							<TooltipContent sideOffset={8}>
								<Typography
									variant="caption"
									className="px-2 py-1 whitespace-pre-wrap"
								>
									{title}
								</Typography>
							</TooltipContent>
						)}
					</Tooltip>
				) : (
					<Popover
						open={isOpenTitlePopover}
						onOpenChange={(nextOpen) => {
							if (isTruncated) {
								setIsOpenTitlePopover(nextOpen);
							}
						}}
					>
						<PopoverTrigger asChild>
							<Row className="min-w-0 justify-center">
								<Typography
									ref={titleRef}
									variant="body2"
									className="w-full truncate text-center"
								>
									{title}
								</Typography>
							</Row>
						</PopoverTrigger>
						{isTruncated && (
							<PopoverContent sideOffset={8} className="w-max max-w-64 p-0">
								<Typography
									variant="caption"
									className="px-2 py-1 whitespace-pre-wrap"
								>
									{title}
								</Typography>
							</PopoverContent>
						)}
					</Popover>
				)}
			</Row>
		</Row>
	);
};
