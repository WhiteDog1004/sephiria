import { Typography } from "@/src/shared";

export const VersionBox = ({ version }: { version: string }) => {
	return (
		<Typography variant="caption" className="text-gray-600">
			버전: {version}
		</Typography>
	);
};
