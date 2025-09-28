"use client";

import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import {
	SectionCostume,
	SectionMiracle,
	SectionWeapon,
	TalentDetail,
	TitleDetail,
} from "@/src/features/build-detail";
import { Box, Column, Row, Separator } from "@/src/shared";

export const BuildDetailClientPage = ({ data }: { data: BuildRow }) => {
	console.log(data);
	return (
		<Box className="w-full p-4">
			<Column className="w-full max-w-5xl gap-4">
				<TitleDetail {...data} />
				<Separator />
				<Box className="md:flex-row flex-col items-start gap-4 md:gap-2 mt-4 p-0">
					<Row className="w-full gap-2">
						<SectionCostume costume={data.costume} />
						<SectionMiracle miracle={data.miracle} />
					</Row>
					<SectionWeapon weapon={data.weapon} />
				</Box>
				<Separator />
				<TalentDetail talent={data.ability} />
			</Column>
		</Box>
	);
};
