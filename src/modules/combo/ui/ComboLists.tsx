"use client";

import type { ComboItem } from "@/src/entities/combo/model/types";
import { ComboList } from "@/src/features/combo/ui/ComboList";
import { SectionHeader } from "@/src/shared/components/section-header";
import { Box } from "@/src/shared/ui/box";

export const ComboLists = ({ data }: { data: ComboItem[] }) => {
	return (
		<Box className="flex-col px-0">
			<SectionHeader
				title={"콤보"}
				description={
					"콤보 종류와 단계별 효과를 한 번에 확인해 보세요.\n아티팩트 보유 개수에 따라 효과가 활성화됩니다."
				}
			/>
			<ComboList data={data} />
		</Box>
	);
};
