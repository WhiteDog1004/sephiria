import clsx from "clsx";
import { Circle, Code2, X } from "lucide-react";
import { Column, Row, Typography } from "@/src/shared";

export const VersionBox = ({
	version,
	hasPresetCode = false,
}: {
	version: string;
	hasPresetCode?: boolean;
}) => {
	const currentVersion = process.env.NEXT_PUBLIC_GAME_VERSION ?? "0.0.0";
	const currentMajorMinor = currentVersion.split(".").slice(0, 2).join(".");
	const targetMajorMinor = version.split(".").slice(0, 2).join(".");

	const isSameVersion = currentMajorMinor === targetMajorMinor;

	return (
		<Column className="items-end w-max gap-0.5">
			<Row
				className={clsx(
					"items-center gap-0.5",
					hasPresetCode
						? "text-cyan-700 dark:text-cyan-200/75"
						: "text-gray-300 dark:text-gray-600",
				)}
			>
				<Code2 className="h-3 w-3" />
				<Typography
					variant="caption"
					className="w-max whitespace-nowrap text-[10px]"
				>
					프리셋 코드
				</Typography>
				{hasPresetCode ? (
					<Circle className="h-2 w-2" />
				) : (
					<X className="h-2.5 w-2.5" />
				)}
			</Row>
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
		</Column>
	);
};
