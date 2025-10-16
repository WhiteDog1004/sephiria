"use client";

import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		toast("복사 성공!", {
			position: "bottom-center",
			style: {
				backgroundColor: "#3e3e3ec5",
				color: "#ffffff",
			},
		});
		return true;
	} catch (error) {
		toast("복사 실패!", {
			position: "bottom-center",
			style: {
				backgroundColor: "#ff000080",
				color: "#ffffff",
			},
		});
		return false;
	}
};
