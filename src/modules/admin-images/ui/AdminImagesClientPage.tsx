"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Images, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type {
	AdminImageBuild,
	AdminImagesResponse,
} from "@/src/entities/admin/model/adminImages.types";
import {
	Button,
	Column,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Row,
	SITEMAP,
	Typography,
} from "@/src/shared";

const PAGE_SIZE = 24;

const getAdminImages = async (page: number) => {
	const response = await fetch(
		`/api/admin/images?page=${page}&pageSize=${PAGE_SIZE}`,
		{ cache: "no-store" },
	);
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "이미지 목록을 불러오지 못했습니다.");
	}

	return json as AdminImagesResponse;
};

const deleteAdminImage = async ({
	postUuid,
	storagePath,
}: {
	postUuid: string;
	storagePath: string;
}) => {
	const response = await fetch("/api/admin/images", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ postUuid, storagePath }),
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "이미지를 삭제하지 못했습니다.");
	}

	return json as { removed: boolean; storageRemoved: boolean };
};

const formatDate = (value: string) =>
	new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
		new Date(value),
	);

export const AdminImagesClientPage = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [selectedBuild, setSelectedBuild] = useState<AdminImageBuild | null>(
		null,
	);
	const { data, error, isLoading, isFetching } = useQuery({
		queryKey: ["admin", "build-images", page],
		queryFn: () => getAdminImages(page),
	});
	const deleteImage = useMutation({
		mutationFn: deleteAdminImage,
		onSuccess: (result, variables) => {
			setSelectedBuild((current) => {
				if (!current || current.postUuid !== variables.postUuid) return current;

				const images = current.images.filter(
					(image) => image.storagePath !== variables.storagePath,
				);
				return images.length > 0 ? { ...current, images } : null;
			});
			void queryClient.invalidateQueries({
				queryKey: ["admin", "build-images"],
			});
			toast.success(
				result.storageRemoved
					? "이미지를 삭제했습니다."
					: "본문에서는 제거됐습니다. Storage 파일은 정기 정리됩니다.",
			);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "이미지를 삭제하지 못했습니다.",
			);
		},
	});

	const totalPages = data ? Math.ceil(data.count / data.pageSize) : 0;

	return (
		<Column className="mx-auto w-full max-w-7xl gap-6 px-3 py-6 md:px-6 md:py-10">
			<Row className="items-center justify-between gap-4">
				<Column className="gap-1">
					<Row className="items-center gap-2">
						<Images className="size-6 text-blue-500" />
						<Typography variant="header2">이미지 관리</Typography>
					</Row>
					<Typography variant="body2" className="text-muted-foreground">
						빌드 본문에 첨부된 이미지를 확인하고 관리합니다.
					</Typography>
				</Column>
				{data && (
					<Typography
						variant="caption"
						className="shrink-0 text-muted-foreground"
					>
						이미지 첨부 게시글 {data.count.toLocaleString()}개
					</Typography>
				)}
			</Row>

			{isLoading ? (
				<Column className="min-h-80 items-center justify-center gap-3">
					<Loader2 className="size-8 animate-spin text-muted-foreground" />
					<Typography variant="body2" className="text-muted-foreground">
						이미지 목록을 불러오고 있습니다.
					</Typography>
				</Column>
			) : error ? (
				<Column className="min-h-80 items-center justify-center gap-3">
					<Typography className="text-destructive">
						{error instanceof Error
							? error.message
							: "이미지 목록을 불러오지 못했습니다."}
					</Typography>
					<Button
						variant="outline"
						onClick={() =>
							queryClient.invalidateQueries({
								queryKey: ["admin", "build-images", page],
							})
						}
					>
						다시 시도
					</Button>
				</Column>
			) : data?.data.length === 0 ? (
				<Column className="min-h-80 items-center justify-center gap-3 rounded-lg border border-dashed">
					<Images className="size-10 text-muted-foreground" />
					<Typography className="text-muted-foreground">
						첨부 이미지가 있는 게시글이 없습니다.
					</Typography>
				</Column>
			) : (
				<div
					className={`grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
						isFetching ? "opacity-60" : ""
					}`}
				>
					{data?.data.map((build) => (
						<article key={build.postUuid} className="min-w-0">
							<button
								type="button"
								className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md border bg-secondary"
								onClick={() => setSelectedBuild(build)}
								aria-label={`${build.title} 첨부 이미지 ${build.images.length}개 보기`}
							>
								{/* biome-ignore lint/performance/noImgElement: Supabase images intentionally bypass Vercel Image Optimization. */}
								<img
									src={build.images[0].src}
									alt={`${build.title} 첨부 이미지`}
									className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
									loading="lazy"
								/>
								{build.images.length > 1 && (
									<span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-1 text-sm font-semibold text-white shadow">
										+{build.images.length - 1}
									</span>
								)}
							</button>
							<Column className="w-full min-w-0 gap-1 pt-2">
								<Link
									href={`${SITEMAP.BUILDS}/${build.postUuid}`}
									className="block w-full truncate text-sm font-semibold hover:text-blue-500 hover:underline"
									title={build.title}
								>
									{build.title}
								</Link>
								<Row className="w-full min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground">
									<span className="min-w-0 truncate">
										{build.writer.nickname || "알 수 없음"}
									</span>
									<span className="shrink-0">
										{formatDate(build.updatedAt || build.createdAt)}
									</span>
								</Row>
							</Column>
						</article>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<Row className="items-center justify-center gap-3 pt-4">
					<Button
						variant="outline"
						disabled={page <= 1 || isFetching}
						onClick={() => setPage((current) => Math.max(current - 1, 1))}
					>
						이전
					</Button>
					<Typography variant="caption">
						{page} / {totalPages}
					</Typography>
					<Button
						variant="outline"
						disabled={page >= totalPages || isFetching}
						onClick={() =>
							setPage((current) => Math.min(current + 1, totalPages))
						}
					>
						다음
					</Button>
				</Row>
			)}

			<Dialog
				open={Boolean(selectedBuild)}
				onOpenChange={(open) => {
					if (!open) setSelectedBuild(null);
				}}
			>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle className="pr-8">
							{selectedBuild?.title ?? "첨부 이미지"}
						</DialogTitle>
						<DialogDescription>
							첨부 이미지 {selectedBuild?.images.length ?? 0}개
						</DialogDescription>
					</DialogHeader>
					{selectedBuild && (
						<>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{selectedBuild.images.map((image, index) => (
									<div
										key={image.storagePath}
										className="relative overflow-hidden rounded-md border bg-secondary"
									>
										<a
											href={image.src}
											target="_blank"
											rel="noreferrer"
											className="block"
										>
											{/* biome-ignore lint/performance/noImgElement: Supabase images intentionally bypass Vercel Image Optimization. */}
											<img
												src={image.src}
												alt={`${selectedBuild.title} 첨부 이미지 ${index + 1}`}
												className="max-h-[60vh] w-full object-contain"
												loading="lazy"
											/>
										</a>
										<Button
											type="button"
											size="icon"
											variant="destructive"
											className="absolute right-2 top-2 size-8"
											disabled={deleteImage.isPending}
											onClick={() => {
												if (
													!window.confirm(
														"이 이미지를 글 본문과 Storage에서 삭제할까요?",
													)
												)
													return;

												deleteImage.mutate({
													postUuid: selectedBuild.postUuid,
													storagePath: image.storagePath,
												});
											}}
											title="이미지 삭제"
										>
											{deleteImage.isPending ? (
												<Loader2 className="animate-spin" />
											) : (
												<Trash2 />
											)}
										</Button>
									</div>
								))}
							</div>
							<Row className="justify-end">
								<Button asChild variant="outline">
									<Link href={`${SITEMAP.BUILDS}/${selectedBuild.postUuid}`}>
										<ExternalLink />
										게시글 열기
									</Link>
								</Button>
							</Row>
						</>
					)}
				</DialogContent>
			</Dialog>
		</Column>
	);
};
