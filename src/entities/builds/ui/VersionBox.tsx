import clsx from "clsx";
import { Row, Typography } from "@/src/shared";

export const VersionBox = ({ version }: { version: string }) => {
	return (
		<Row className="items-center w-max gap-1">
			<Typography
				variant="caption"
				className={`w-max whitespace-nowrap ${clsx(process.env.NEXT_PUBLIC_GAME_VERSION === version ? "text-yellow-600/70 dark:text-yellow-500/70" : "text-gray-400 dark:text-gray-600")}`}
			>
				버전: {version}
			</Typography>
		</Row>
	);
};
