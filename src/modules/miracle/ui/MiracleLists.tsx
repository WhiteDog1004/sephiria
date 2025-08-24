"use client";

import type { MiracleOptions } from "@/src/entities/miracle/model/types";
import { MiracleList } from "@/src/features/miracle/ui/MiracleList";
import { SectionHeader } from "@/src/shared/components/section-header";
import { Box } from "@/src/shared/ui/box";

export const MiracleLists = ({ data }: MiracleOptions) => {
	return (
		<Box className="flex-col">
			<SectionHeader
				title={"기적"}
				description={"나무뿌리를 통해 새로운 빌드를 구성해 보세요!"}
			/>
			<MiracleList data={data} />
		</Box>
	);
};
