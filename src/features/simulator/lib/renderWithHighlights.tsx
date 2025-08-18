import { Fragment } from "react";
import { Typography } from "@/src/shared/ui/typography";

export const renderWithHighlights = (text: string, keyPrefix: string) => {
	const processed = text.replace(/\[고유\]/g, "[고유]\n");
	return processed.split("[고유]\n").map((seg, i, arr) => (
		<Fragment key={`${keyPrefix}-${seg}-highlight`}>
			{seg}
			{i < arr.length - 1 && (
				<Typography className="inline text-yellow-300" variant="caption">
					[고유]
				</Typography>
			)}
		</Fragment>
	));
};
