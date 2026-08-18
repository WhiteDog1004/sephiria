"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "../config/ads";

declare global {
	interface Window {
		adsbygoogle?: unknown[];
	}
}

type AdSenseHorizontalProps = {
	className?: string;
};

export const AdSenseHorizontal = ({ className }: AdSenseHorizontalProps) => {
	useEffect(() => {
		if (!ADS_ENABLED) return;

		try {
			window.adsbygoogle = window.adsbygoogle || [];
			window.adsbygoogle.push({});
		} catch {}
	}, []);

	return (
		<div
			className={cn(
				"mx-auto w-full max-w-5xl px-0 py-3 min-h-[90px] overflow-hidden",
				className,
			)}
		>
			{ADS_ENABLED ? (
				<ins
					className="adsbygoogle"
					style={{ display: "block", width: "100%", minHeight: 90 }}
					data-ad-client={ADSENSE_CLIENT_ID}
					data-ad-slot="7125865834"
					data-ad-format="auto"
					data-full-width-responsive="true"
				/>
			) : (
				<div className="flex h-[90px] w-full items-center justify-center rounded-sm border border-gray-500/40 border-dashed text-gray-500 text-xs">
					광고 영역 (프로덕션에서만 게재됩니다)
				</div>
			)}
		</div>
	);
};
