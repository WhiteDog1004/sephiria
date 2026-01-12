"use client";

import { CircleHelp } from "lucide-react";
import { useState } from "react";
import {
	Column,
	ImageWithFallback,
	Row,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import type { WeaponRow } from "../../weapon";

export const SubWeaponBox = ({ weapon }: { weapon: WeaponRow }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Column className="relative items-center gap-1 opacity-50">
			<Tooltip open={isOpen} onOpenChange={setIsOpen} delayDuration={400}>
				<TooltipTrigger asChild>
					<Row className="absolute -top-5">
						<CircleHelp className="size-4" onClick={() => setIsOpen(true)} />
					</Row>
				</TooltipTrigger>
				<TooltipContent sideOffset={16}>
					<Row className="bg-accent border-2 dark:text-white text-black p-2 max-w-40 justify-center items-center text-center">
						<Typography variant="caption">{weapon.value_kor}</Typography>
					</Row>
				</TooltipContent>
			</Tooltip>
			<ImageWithFallback
				className="w-8 h-8 object-contain p-0"
				width={32}
				height={32}
				src={getCloudflareUrl(weapon.image || "") || ""}
				alt={weapon.value}
				unoptimized
			/>
		</Column>
	);
};
