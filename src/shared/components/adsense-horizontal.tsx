"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
		try {
			window.adsbygoogle = window.adsbygoogle || [];
			window.adsbygoogle.push({});
		} catch {
			// Ad blockers or delayed script loading can make AdSense throw in dev.
		}
	}, []);

	return (
		<div
			className={cn(
				"mx-auto w-full max-w-5xl px-0 py-3 min-h-[90px] overflow-hidden",
				className,
			)}
		>
			<ins
				className="adsbygoogle"
				style={{ display: "block", width: "100%", minHeight: 90 }}
				data-ad-client="ca-pub-3851224465271826"
				data-ad-slot="7125865834"
				data-ad-format="auto"
				data-full-width-responsive="true"
			/>
		</div>
	);
};
