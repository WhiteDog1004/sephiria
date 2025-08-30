import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Box } from "@/src/shared/ui/box";
import { Typography } from "@/src/shared/ui/typography";
import type { ArtifactInstance, SlabsOptions, SlotId } from "../../types";
import { SlotComponent } from "./SlotComponent";

export const InventorySlot = ({
	id,
	item,
	effectValue,
	effectFlag,
	onRotate,
	isOver,
}: {
	id: SlotId;
	item?: SlabsOptions & ArtifactInstance;
	effectValue: number;
	effectFlag: "ignore" | null;
	onRotate: (id: string, e: React.MouseEvent) => void;
	isOver: boolean;
}) => {
	const { theme } = useTheme();
	const { setNodeRef } = useDroppable({ id, data: { type: "slot" } });
	const boxStyles = `absolute top-0 left-0 w-full h-full p-1 flex items-start justify-start z-50 pointer-events-none`;

	return (
		<Box
			ref={setNodeRef}
			className={`relative w-16 h-16 xl:w-18 xl:h-18 rounded-sm p-1 border-4 border-[#222034] transition-colors bg-[#623144] ${clsx(
				theme === "light" && "bg-gray-300",
				item &&
					(item.type === "slabs"
						? theme === "light"
							? "bg-gray-500"
							: "bg-[#3a3a57]"
						: theme === "light"
							? "bg-gray-400"
							: "bg-[#3a3a47]"),
				isOver && "bg-gray-600",
			)}`}
		>
			<Box className="absolute w-9/12 h-9/12 xl:w-10/12 xl:h-10/12 border-2 border-gray-950/20 rounded-sm p-6 xl:p-7" />
			{item && (
				<SlotComponent
					item={item}
					isDragging={false}
					onRotate={(e) => onRotate(item.id, e)}
				/>
			)}
			{effectValue > 0 ? (
				<Box
					className={`${boxStyles} gap-1 ${clsx(!!item?.item && (effectValue === Number(item?.item.level) ? "text-green-400" : effectValue > Number(item?.item.level) ? "text-yellow-300" : "text-white"))}`}
				>
					<Typography>{effectValue}</Typography>
					{item?.type === "artifact" && (
						<>
							<Typography>/</Typography>
							<Typography>{item.item.level}</Typography>
						</>
					)}
				</Box>
			) : (
				effectValue < 0 && (
					<Box className={`${boxStyles} gap-1 text-red-600`}>
						{effectValue}
						{item?.type === "artifact" && (
							<>
								<Typography>/</Typography>
								<Typography>{item.item.level}</Typography>
							</>
						)}
					</Box>
				)
			)}
			{effectFlag === "ignore" && (
				<Box className={`${boxStyles} bg-blue-300/30`} />
			)}
			{!!item?.item && !effectValue && (
				<Box
					className={`${boxStyles} ${clsx(item.item.level === 0 && "text-green-400")}`}
				>
					<Typography>0 / {item.item.level}</Typography>
				</Box>
			)}
		</Box>
	);
};
