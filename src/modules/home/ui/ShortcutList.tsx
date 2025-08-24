"use client";

import { ShortcutBox } from "@/src/features/home/ui/ShortcutBox";
import { Box } from "@/src/shared/ui/box";
import type { Database } from "@/types_db";

export const ShortcutList = ({
	data,
}: {
	data: Database["public"]["Tables"]["costume"]["Row"][];
}) => {
	return (
		<Box className="p-0">
			<ShortcutBox data={data || []} />
		</Box>
	);
};
