"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MiracleOptions } from "@/src/entities/miracle/model/types";
import { SITEMAP } from "@/src/shared/config/sitemap";
import { Button } from "@/src/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/src/shared/ui/dialog";
import { getCloudflareUrl } from "@/src/shared/utils/image";

type Miracle = MiracleOptions["data"][number];

const MiracleEffects = ({
	effects,
	compact = false,
}: {
	effects: Miracle["effects"];
	compact?: boolean;
}) => (
	<span className={cn("block space-y-2", compact && "space-y-1.5")}>
		{(
			[
				["reward", effects.reward],
				["penalty", effects.penalty],
			] as const
		).map(([type, options]) =>
			options?.map((option) => (
				<span
					key={`${type}-${option}`}
					className={cn(
						"block break-words text-sm leading-5",
						compact ? "text-xs" : "rounded-lg border bg-muted/40 px-3 py-2.5",
						type === "penalty"
							? "text-red-500 dark:text-red-400"
							: "text-emerald-600 dark:text-emerald-400",
					)}
				>
					<span className="sr-only">
						{type === "penalty" ? "페널티: " : "보너스: "}
					</span>
					{option}
				</span>
			)),
		)}
	</span>
);

const MiracleDetail = ({ miracle }: { miracle: Miracle }) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		miracle: miracle.value,
	});

	return (
		<>
			<div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-white/10 bg-[#090a0d]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(251,191,36,0.16),transparent_52%)]" />
				{miracle.image ? (
					<Image
						width={80}
						height={80}
						src={getCloudflareUrl(miracle.image)}
						alt={`${miracle.value_kor} 기적`}
						className="relative size-20 object-contain [image-rendering:pixelated]"
						unoptimized
					/>
				) : (
					<Sparkles className="relative size-12 text-amber-400" />
				)}
			</div>
			<div className="space-y-6 p-5 sm:p-6">
				<div>
					<p className="mb-1 text-xs font-medium tracking-[0.16em] text-muted-foreground">
						선택한 기적
					</p>
					<h2 className="text-xl font-bold tracking-tight sm:text-2xl">
						{miracle.value_kor}
					</h2>
				</div>
				<div>
					<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
						<Sparkles className="size-4 text-amber-500" />
						기적 옵션
					</h3>
					<MiracleEffects effects={miracle.effects} />
				</div>
				<Button
					asChild
					className="h-12 w-full border-0 bg-amber-400 font-bold text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:bg-amber-300 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
				>
					<Link href={`${SITEMAP.BUILDS}?${params.toString()}`}>
						{miracle.value_kor} 빌드 보러가기
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
		</>
	);
};

export const MiracleList = ({ data }: MiracleOptions) => {
	const selectedButtonRef = useRef<HTMLButtonElement | null>(null);
	const [selectedValue, setSelectedValue] = useState(data[0]?.value ?? "");
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const selectedMiracle =
		data.find((miracle) => miracle.value === selectedValue) ?? data[0];

	if (!selectedMiracle) {
		return (
			<div className="w-full max-w-3xl rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
				표시할 기적이 없습니다.
			</div>
		);
	}

	return (
		<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
			<div className="grid w-full max-w-7xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
				<section
					aria-label="기적 목록"
					className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3"
				>
					{data.map((miracle) => {
						const isSelected = miracle.value === selectedMiracle.value;

						return (
							<DialogTrigger asChild key={miracle.id}>
								<button
									type="button"
									onClick={(event) => {
										selectedButtonRef.current = event.currentTarget;
										setSelectedValue(miracle.value);
										if (window.matchMedia("(min-width: 1024px)").matches) {
											event.preventDefault();
										}
									}}
									aria-pressed={isSelected}
									className={cn(
										"group flex min-w-0 flex-col items-center gap-3 rounded-xl border bg-card p-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4",
										isSelected && "border-amber-400 ring-2 ring-amber-400/30",
									)}
								>
									<span className="relative flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#090a0d]">
										<span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(255,255,255,0.10),transparent_48%)]" />
										{miracle.image ? (
											<Image
												width={44}
												height={44}
												src={getCloudflareUrl(miracle.image)}
												alt={`${miracle.value_kor} 기적`}
												className="relative size-11 object-contain [image-rendering:pixelated] transition-transform duration-200 group-hover:scale-105"
												unoptimized
											/>
										) : (
											<Sparkles className="relative size-6 text-amber-400" />
										)}
									</span>
									<span className="text-sm font-semibold">
										{miracle.value_kor}
									</span>
									<span className="w-full border-t pt-3">
										<MiracleEffects effects={miracle.effects} compact />
									</span>
								</button>
							</DialogTrigger>
						);
					})}
				</section>
				<aside
					aria-label="선택한 기적 상세 정보"
					aria-live="polite"
					className="sticky top-24 hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block"
				>
					<MiracleDetail miracle={selectedMiracle} />
				</aside>
			</div>
			<DialogContent
				onCloseAutoFocus={(event) => {
					event.preventDefault();
					selectedButtonRef.current?.focus();
				}}
				className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-md lg:hidden [&_[data-slot=dialog-close]]:bg-black/50 [&_[data-slot=dialog-close]]:text-white"
			>
				<DialogTitle className="sr-only">
					{selectedMiracle.value_kor} 기적 상세 정보
				</DialogTitle>
				<DialogDescription className="sr-only">
					선택한 기적의 보너스와 페널티를 확인하고 관련 빌드를 찾아보세요.
				</DialogDescription>
				<MiracleDetail miracle={selectedMiracle} />
			</DialogContent>
		</Dialog>
	);
};
