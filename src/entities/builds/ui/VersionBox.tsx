import clsx from "clsx";
import { Row, Typography } from "@/src/shared";

export const VersionBox = ({ version }: { version: string }) => {
	const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
	const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");
	const targetMajorMinor = version.split(".").slice(0, 2).join(".");

	const isSameVersion = currentMajorMinor === targetMajorMinor;

	return (
		<Row className="items-center w-max gap-1">
			<Typography
				variant="caption"
				className={clsx(
					"w-max whitespace-nowrap",
					isSameVersion
						? "text-yellow-600/70 dark:text-yellow-500/70"
						: "text-gray-400 dark:text-gray-600",
				)}
			>
				버전: {version}
			</Typography>
		</Row>
	);
};
