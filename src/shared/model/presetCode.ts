import { z } from "zod";

export const PRESET_CODE_PREFIX = "AAF_PRESET_OBFZ|";
export const PRESET_CODE_PATTERN = /^AAF_PRESET_OBFZ\|[A-Za-z0-9+/]+={0,2}$/;

export const isValidPresetCode = (code: string) =>
	PRESET_CODE_PATTERN.test(code);

export const presetCodeSchema = z
	.string()
	.trim()
	.refine((code) => code === "" || isValidPresetCode(code), {
		message: `올바른 프리셋 코드를 입력해 주세요.`,
	});

export const normalizePresetCode = (code?: string | null) => {
	const normalized = code?.trim() ?? "";
	return normalized || null;
};
