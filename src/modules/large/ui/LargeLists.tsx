"use client";

import { LargeList } from "@/src/features/large/ui/LargeList";
import { SectionHeader } from "@/src/shared/components/section-header";
import { Box } from "@/src/shared/ui/box";

export const LargeLists = () => {
	return (
		<Box className="flex-col">
			<SectionHeader
				title={"석판"}
				description={"원하는 석판에 마우스를 올리면 효과를 볼 수 있어요!"}
			/>
			<LargeList />
		</Box>
	);
};
