"use client";

import { ArrowRight, Info, LockKeyhole, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { ArtifactDetailDialog } from "@/src/features/artifact/ui/ArtifactDetailDialog";
import { AdSenseHorizontal } from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import {
	COSTUMES,
	type CostumeDataType,
	type CostumeType,
} from "@/src/shared/config/costumes";
import { SITEMAP } from "@/src/shared/config/sitemap";
import { containsRedKeyword } from "@/src/shared/model/containsWords";
import { getStartingArtifactName } from "@/src/shared/model/getStartingArtifactName";
import { Box } from "@/src/shared/ui/box";
import { Button } from "@/src/shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/src/shared/ui/dialog";
import { getCloudflareUrl } from "@/src/shared/utils/image";

const getCostumeBuildSearchHref = (costume: string) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		costume,
	});

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};

const CostumeDetail = ({
	costume,
	detail,
	startingArtifacts,
	compact = false,
}: {
	costume: CostumeDataType[number];
	detail: CostumeType;
	startingArtifacts: ArtifactInstance["item"][];
	compact?: boolean;
}) => (
	<>
		<div
			className={cn(
				"relative overflow-hidden border-b border-white/10 bg-[#090a0d]",
				compact ? "h-32 sm:h-40" : "h-48",
			)}
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(251,191,36,0.16),transparent_52%)]" />
			<Image
				fill
				sizes="(max-width: 1024px) 90vw, 360px"
				src={getCloudflareUrl(costume.image || "")}
				alt={`${detail.name} 코스튬 상세 이미지`}
				className={cn(
					"object-contain [image-rendering:pixelated]",
					compact ? "px-[38%] py-3" : "px-[38%] py-5",
				)}
				unoptimized
			/>
		</div>

		<div className={cn("p-5 sm:p-6", compact ? "space-y-4" : "space-y-6")}>
			<div>
				<p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
					선택한 코스튬
				</p>
				<h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
					{detail.name}
				</h2>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{detail.story}
				</p>
			</div>

			<div>
				<div className="mb-3 flex items-center gap-2 text-sm font-semibold">
					<Sparkles className="size-4 text-amber-500" />
					코스튬 효과
				</div>
				<ul className="space-y-2">
					{detail.options.map((option) => {
						const artifactName = getStartingArtifactName(option);
						const artifact = artifactName
							? startingArtifacts.find(
									(item) => item.label_kor === artifactName,
								)
							: undefined;

						return (
							<li
								key={`${costume.id}-${option}`}
								className={cn(
									"rounded-lg border bg-muted/40 px-3 py-2.5 text-sm leading-5",
									containsRedKeyword(option)
										? "text-red-500 dark:text-red-400"
										: "text-emerald-600 dark:text-emerald-400",
									artifact &&
										"transition-colors hover:border-amber-400/60 hover:bg-amber-400/5",
								)}
							>
								{artifact ? (
									<ArtifactDetailDialog item={artifact}>
										<button
											type="button"
											className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
										>
											<span>{option}</span>
											<span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-300">
												<Info className="size-3.5" />
												옵션 보기
											</span>
										</button>
									</ArtifactDetailDialog>
								) : (
									option
								)}
							</li>
						);
					})}
				</ul>
			</div>

			<div className="rounded-lg border bg-muted/30 px-3 py-3">
				<div className="mb-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
					<LockKeyhole className="size-3.5" />
					획득 조건
				</div>
				<p className="text-sm leading-5">{detail.unlock ?? "기본 코스튬"}</p>
			</div>

			<Button
				asChild
				variant="default"
				className="h-12 w-full border-0 bg-amber-400 font-bold text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:bg-amber-300 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
			>
				<Link href={getCostumeBuildSearchHref(costume.value)}>
					{detail.name} 빌드 보러가기
					<ArrowRight className="size-4" />
				</Link>
			</Button>
		</div>
	</>
);

export const CostumeList = ({
	data,
	startingArtifacts,
}: {
	data: CostumeDataType;
	startingArtifacts: ArtifactInstance["item"][];
}) => {
	const [selectedValue, setSelectedValue] = useState(data[0]?.value ?? "");
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const selectedCostume =
		data.find((costume) => costume.value === selectedValue) ?? data[0];
	const selectedDetail = selectedCostume
		? COSTUMES[selectedCostume.value]
		: undefined;

	const selectCostume = (value: string) => {
		setSelectedValue(value);

		if (window.matchMedia("(max-width: 1023px)").matches) {
			setIsDetailOpen(true);
		}
	};

	return (
		<Box className="flex-col items-center gap-5 px-4 py-8 sm:px-6">
			<SectionHeader
				title="코스튬"
				description="코스튬을 선택해 능력과 획득 조건을 확인해 보세요."
			/>
			<AdSenseHorizontal />

			{selectedCostume && selectedDetail ? (
				<div className="grid w-full max-w-7xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
					<section
						aria-label="코스튬 목록"
						className="order-1 flex flex-wrap content-start justify-center gap-x-1.5 gap-y-3 sm:justify-start"
					>
						{data.map((costume) => {
							const costumeDetail = COSTUMES[costume.value];
							const isSelected = costume.value === selectedCostume.value;

							if (!costumeDetail) return null;

							return (
								<button
									type="button"
									key={costume.id}
									onClick={() => selectCostume(costume.value)}
									aria-pressed={isSelected}
									title={costumeDetail.name}
									className={cn(
										"group w-[88px] min-w-0 rounded-lg text-center transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									)}
								>
									<div
										className={cn(
											"relative mx-auto size-[60px] overflow-hidden rounded-lg border border-white/10 bg-[#090a0d] shadow-sm transition group-hover:border-foreground/40",
											isSelected && "border-amber-400 ring-2 ring-amber-400/30",
										)}
									>
										<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(255,255,255,0.10),transparent_48%)]" />
										<Image
											fill
											sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 180px"
											src={getCloudflareUrl(costume.image || "")}
											alt={`${costumeDetail.name} 코스튬`}
											className="object-contain px-[18%] py-[12%] [image-rendering:pixelated] transition-transform duration-200 group-hover:scale-105"
											unoptimized
										/>
									</div>
									<p className="whitespace-nowrap px-0.5 pt-2 text-[11px] font-medium leading-4">
										{costumeDetail.name}
									</p>
								</button>
							);
						})}
					</section>

					<aside
						aria-live="polite"
						className="sticky top-24 order-2 hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block"
					>
						<CostumeDetail
							costume={selectedCostume}
							detail={selectedDetail}
							startingArtifacts={startingArtifacts}
						/>
					</aside>

					<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
						<DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-md lg:hidden [&_[data-slot=dialog-close]]:bg-black/50 [&_[data-slot=dialog-close]]:text-white">
							<DialogTitle className="sr-only">
								{selectedDetail.name} 코스튬 상세 정보
							</DialogTitle>
							<CostumeDetail
								costume={selectedCostume}
								detail={selectedDetail}
								startingArtifacts={startingArtifacts}
								compact
							/>
						</DialogContent>
					</Dialog>
				</div>
			) : (
				<div className="w-full max-w-3xl rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					표시할 코스튬이 없습니다.
				</div>
			)}
		</Box>
	);
};
