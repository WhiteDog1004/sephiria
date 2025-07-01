import { useDroppable } from "@dnd-kit/core";
import { Box } from "@/src/shared/ui/box";

export const DeleteTrash = ({ isOver }: { isOver: boolean }) => {
	const { setNodeRef } = useDroppable({ id: "trash", data: { type: "trash" } });
	return (
		<Box
			ref={setNodeRef}
			className={`w-full p-0 h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${isOver ? "bg-red-800 border-red-500" : "bg-gray-800 border-gray-600"}`}
		>
			<span className="text-gray-400">아이템을 여기로 드래그하여 삭제</span>
		</Box>
	);
};
