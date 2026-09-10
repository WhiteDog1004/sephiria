import { Fragment } from "react";
import { Typography } from "@/src/shared/ui/typography";

const WEAPON_ONLY_REGEX = /(검과 방패 전용|대검 전용|단검 전용|석궁 전용|도 전용|봉 전용)/g;

const renderWeaponOnlyHighlights = (text: string, keyPrefix: string) =>
	text.split(WEAPON_ONLY_REGEX).map((seg, i) => {
		if (seg.match(WEAPON_ONLY_REGEX)) {
			return (
				<Typography
					key={`${keyPrefix}-${i}-weapon-only`}
					className="inline text-red-500 font-semibold"
					variant="caption"
				>
					{seg}
				</Typography>
			);
		}

		return <Fragment key={`${keyPrefix}-${i}-text`}>{seg}</Fragment>;
	});

export const renderWithHighlights = (text: string, keyPrefix: string) => {
	const processed = text.replace(/\[고유\]/g, "[고유]\n");
	return processed.split("[고유]\n").map((seg, i, arr) => (
		<Fragment key={`${keyPrefix}-${seg}-highlight`}>
			{renderWeaponOnlyHighlights(seg, `${keyPrefix}-${i}`)}
			{i < arr.length - 1 && (
				<Typography className="inline text-yellow-300" variant="caption">
					[고유]
				</Typography>
			)}
		</Fragment>
	));
};
