import clsx from "clsx";
import { Row, Typography } from "@/src/shared";

export const VersionBox = ({ version }: { version: string }) => {
	return (
		<Row className="items-center w-max gap-1">
			<Typography
				variant="caption"
				className={`w-max whitespace-nowrap ${clsx(process.env.NEXT_PUBLIC_GAME_VERSION === version ? "text-yellow-700 dark:text-yellow-500" : "text-gray-400 dark:text-gray-600")}`}
			>
				{process.env.NEXT_PUBLIC_GAME_VERSION === version && "버전:"} {version}
			</Typography>
			{process.env.NEXT_PUBLIC_GAME_VERSION !== version && (
				<Typography
					variant="caption"
					className="w-max text-gray-400 dark:text-gray-600"
				>
					(이전버전)
				</Typography>
			)}
		</Row>
	);
};
