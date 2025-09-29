import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { Column, Typography } from "@/src/shared";

export const BuildDescription = ({
	description,
}: {
	description: BuildRow["description"];
}) => {
	return (
		<Column className="gap-4">
			<Typography variant="header3">빌드 설명</Typography>
			<Column className="border rounded-lg p-4 bg-secondary/50">
				<Typography variant="body2" className="whitespace-pre-line">
					{description}
				</Typography>
			</Column>
		</Column>
	);
};
