import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { Box } from "@/src/shared/ui/box";
import { useTheme } from "next-themes";
import clsx from "clsx";

export const DeleteTrash = ({ isOver }: { isOver: boolean }) => {
	const { theme } = useTheme();
	const { setNodeRef } = useDroppable({ id: "trash", data: { type: "trash" } });
	return (
		<Box
			ref={setNodeRef}
			className={`w-full max-w-24 p-0 h-24 border-2 border-dashed rounded-lg items-center justify-center transition-colors ${clsx(
				isOver ? "bg-red-800 border-red-500" : "bg-[#2f1c2c] border-[#ffffff50]",
				theme === 'light' && "bg-[#2f1c2c80]"
			)}`}
		>
			<Trash2 className="text-white opacity-50" />
		</Box>
	);
};
