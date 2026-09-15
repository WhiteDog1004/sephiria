"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { Column, Typography } from "@/src/shared";
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";

type LightboxImage = {
	alt: string;
	origin: {
		scale: number;
		x: number;
		y: number;
	};
	src: string;
};

export const BuildDescription = ({
	description,
}: {
	description: BuildRow["description"];
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const lastFocusedImageRef = useRef<HTMLImageElement | null>(null);
	const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
	const [selectedImage, setSelectedImage] = useState<LightboxImage | null>(
		null,
	);
	const shouldReduceMotion = useReducedMotion();
	const safeDescription = sanitizeBuildDescriptionHtml(description);

	useEffect(() => {
		setPortalElement(document.body);
	}, []);

	useEffect(() => {
		if (!safeDescription) return;

		const images = contentRef.current?.querySelectorAll<HTMLImageElement>(
			'img[data-build-image="true"]',
		);
		const cleanups: Array<() => void> = [];

		images?.forEach((image) => {
			image.tabIndex = 0;
			image.setAttribute("role", "button");
			image.setAttribute(
				"aria-label",
				`${image.alt || "첨부 이미지"} 크게 보기`,
			);
			cleanups.push(() => {
				image.removeAttribute("tabindex");
				image.removeAttribute("role");
				image.removeAttribute("aria-label");
			});
		});

		return () => {
			cleanups.forEach((cleanup) => cleanup());
		};
	}, [safeDescription]);

	useEffect(() => {
		if (!selectedImage) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedImage(null);
				window.requestAnimationFrame(() =>
					lastFocusedImageRef.current?.focus(),
				);
			}
			if (event.key === "Tab") {
				event.preventDefault();
				closeButtonRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedImage]);

	const openImage = (target: EventTarget | null) => {
		if (!(target instanceof HTMLImageElement)) return false;
		if (target.dataset.buildImage !== "true") return false;

		const rect = target.getBoundingClientRect();
		const viewportPadding = window.innerWidth >= 768 ? 64 : 32;
		const naturalWidth = target.naturalWidth || rect.width;
		const naturalHeight = target.naturalHeight || rect.height;
		const fitScale = Math.min(
			1,
			(window.innerWidth - viewportPadding) / naturalWidth,
			(window.innerHeight - viewportPadding) / naturalHeight,
		);
		const finalWidth = naturalWidth * fitScale;

		lastFocusedImageRef.current = target;
		setSelectedImage({
			alt: target.alt,
			origin: {
				scale: finalWidth > 0 ? rect.width / finalWidth : 0.88,
				x: rect.left + rect.width / 2 - window.innerWidth / 2,
				y: rect.top + rect.height / 2 - window.innerHeight / 2,
			},
			src: target.currentSrc || target.src,
		});
		return true;
	};

	const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
		openImage(event.target);
	};

	const handleContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		if (!openImage(event.target)) return;
		event.preventDefault();
	};

	const closeImage = () => {
		setSelectedImage(null);
		window.requestAnimationFrame(() => lastFocusedImageRef.current?.focus());
	};

	return (
		<>
			<Column className="gap-4">
				<Typography variant="header3">빌드 설명</Typography>
				<Column
					className="border rounded-lg p-4 bg-secondary/50"
					onClick={handleContentClick}
					onKeyDown={handleContentKeyDown}
				>
					<div
						ref={contentRef}
						className="build-description-content text-sm leading-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_img[data-emote='true']]:mx-1 [&_img[data-emote='true']]:inline-block [&_img[data-emote='true']]:size-28 [&_img[data-emote='true']]:align-middle [&_img[data-emote='true']]:[image-rendering:pixelated] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:min-h-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-secondary [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: build descriptions are sanitized before rendering.
						dangerouslySetInnerHTML={{
							__html: safeDescription,
						}}
					/>
				</Column>
			</Column>

			{portalElement &&
				createPortal(
					<AnimatePresence>
						{selectedImage && (
							<motion.div
								className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
								onClick={(event) => {
									if (event.target === event.currentTarget) closeImage();
								}}
								role="dialog"
								aria-modal="true"
								aria-label={selectedImage.alt || "첨부 이미지 크게 보기"}
							>
								{/* biome-ignore lint/performance/noImgElement: the lightbox must preserve original and animated WebP images without optimization. */}
								<motion.img
									src={selectedImage.src}
									alt={selectedImage.alt}
									className="max-h-[calc(100dvh-2rem)] max-w-full cursor-default select-none rounded-md object-contain shadow-2xl md:max-h-[calc(100dvh-4rem)]"
									initial={
										shouldReduceMotion
											? false
											: {
													opacity: 0.7,
													scale: selectedImage.origin.scale,
													x: selectedImage.origin.x,
													y: selectedImage.origin.y,
												}
									}
									animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
									exit={
										shouldReduceMotion
											? { opacity: 0 }
											: {
													opacity: 0,
													scale: selectedImage.origin.scale,
													x: selectedImage.origin.x,
													y: selectedImage.origin.y,
												}
									}
									transition={
										shouldReduceMotion
											? { duration: 0 }
											: { type: "spring", stiffness: 280, damping: 28 }
									}
									draggable={false}
								/>
								<button
									ref={closeButtonRef}
									type="button"
									className="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-6 md:top-6"
									onClick={closeImage}
									aria-label="이미지 크게 보기 닫기"
								>
									<X className="size-5" />
								</button>
							</motion.div>
						)}
					</AnimatePresence>,
					portalElement,
				)}
		</>
	);
};
