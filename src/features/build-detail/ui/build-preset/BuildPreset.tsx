import { Copy } from "lucide-react";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import {
	Button,
	copyToClipboard,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/shared";

type BuildPresetProps = {
	presetCode: BuildRow["preset_code"];
};

export const BuildPreset = ({ presetCode }: BuildPresetProps) => {
	const button = (
		<Button
			variant="outline"
			disabled={!presetCode}
			onClick={() => {
				if (presetCode) {
					void copyToClipboard(presetCode);
				}
			}}
		>
			<Copy />
			프리셋 코드 복사
		</Button>
	);

	if (!presetCode) {
		return (
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<span className="inline-flex">
						{button}
					</span>
				</TooltipTrigger>
				<TooltipContent className="p-2" sideOffset={8}>
					등록된 프리셋 코드가 없습니다.
				</TooltipContent>
			</Tooltip>
		);
	}

	return (
		button
	);
};
