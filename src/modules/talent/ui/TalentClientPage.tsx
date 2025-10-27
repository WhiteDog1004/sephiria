"use client";

import { TalentWrapper } from "@/src/features/talent";
import { Box, Column } from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";

export const TalentClientPage = () => {
	return (
		<Box className="w-full">
			<Column className="w-full max-w-4xl items-center gap-2">
				<SectionHeader
					title={"재능"}
					description={"재능을 확인하고 나만의 빌드를 완성해 보세요!"}
				/>
				<TalentWrapper />
			</Column>
		</Box>
	);
};
