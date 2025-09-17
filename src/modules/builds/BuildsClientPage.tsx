import { Box, Column, Row } from "@/src/shared";
import { BuildsCard } from "./BuildsCard";

export const BuildsClientPage = () => {
	return (
		<Row className="w-full p-6 justify-center gap-6">
			<Box className="max-w-7xl w-full p-0">
				<Column className="w-full justify-center">
					<Row></Row>
					<Box className="grid grid-cols-[repeat(auto-fill,minmax(480px,1fr))] gap-6 w-full p-0">
						{/* 임시 더미 ui */}
						<BuildsCard />
						<BuildsCard />
						<BuildsCard />
						<BuildsCard />
					</Box>
				</Column>
			</Box>
			<Column className="min-w-60 border rounded-md"></Column>
		</Row>
	);
};
