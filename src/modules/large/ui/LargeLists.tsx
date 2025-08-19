"use client";

import { LargeList } from "@/src/features/large/ui/LargeList";
import { LargeTitle } from "@/src/features/large/ui/LargeTitle";
import { Box } from "@/src/shared/ui/box";

export const LargeLists = () => {
	return (
		<Box className="flex-col">
			<LargeTitle />
			<LargeList />
		</Box>
	);
};
