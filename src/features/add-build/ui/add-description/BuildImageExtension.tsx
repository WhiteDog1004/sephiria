"use client";

import { mergeAttributes, Node as TiptapNode } from "@tiptap/core";
import {
	type NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	BUILD_IMAGE_MAX_WIDTH,
	BUILD_IMAGE_MIN_WIDTH,
} from "@/src/shared/model/buildImage";

const normalizeWidth = (value: unknown) => {
	const width = Number(value);

	if (!Number.isFinite(width)) return 720;
	return Math.min(
		BUILD_IMAGE_MAX_WIDTH,
		Math.max(BUILD_IMAGE_MIN_WIDTH, Math.round(width)),
	);
};

const buildImageAlignments = ["left", "center", "right"] as const;
type BuildImageAlignment = (typeof buildImageAlignments)[number];

const normalizeAlignment = (value: unknown): BuildImageAlignment =>
	buildImageAlignments.includes(value as BuildImageAlignment)
		? (value as BuildImageAlignment)
		: "left";

const BuildImageNodeView = ({
	deleteNode,
	node,
	selected,
	updateAttributes,
}: NodeViewProps) => {
	const initialWidth = normalizeWidth(node.attrs.width);
	const alignment = normalizeAlignment(node.attrs.align);
	const alignmentClass = {
		left: "justify-start",
		center: "justify-center",
		right: "justify-end",
	}[alignment];
	const [previewWidth, setPreviewWidth] = useState(initialWidth);
	const previewWidthRef = useRef(initialWidth);
	const resizeRef = useRef<{
		maxWidth: number;
		startWidth: number;
		startX: number;
	} | null>(null);

	const finishResize = () => {
		if (!resizeRef.current) return;
		resizeRef.current = null;
		updateAttributes({ width: Math.round(previewWidthRef.current) });
	};

	useEffect(() => {
		const width = normalizeWidth(node.attrs.width);
		previewWidthRef.current = width;
		setPreviewWidth(width);
	}, [node.attrs.width]);

	return (
		<NodeViewWrapper
			className={`my-3 flex ${alignmentClass}`}
			data-build-image-wrapper
		>
			<div
				className={`group relative max-w-full rounded-md ${
					selected ? "ring-2 ring-primary ring-offset-2" : ""
				}`}
				style={{ width: `${previewWidth}px` }}
			>
				{/* biome-ignore lint/performance/noImgElement: editor images intentionally bypass Vercel Image Optimization. */}
				<img
					src={node.attrs.src}
					alt={node.attrs.alt}
					className="block h-auto w-full rounded-md"
					draggable={false}
				/>
				{selected && (
					<>
						<div className="absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-0.5 rounded-md bg-black/75 p-1 text-white shadow-lg">
							{(
								[
									["left", AlignLeft, "이미지 왼쪽 정렬"],
									["center", AlignCenter, "이미지 가운데 정렬"],
									["right", AlignRight, "이미지 오른쪽 정렬"],
								] as const
							).map(([value, Icon, title]) => (
								<button
									key={value}
									type="button"
									aria-pressed={alignment === value}
									className={`flex size-7 items-center justify-center rounded-sm hover:bg-white/20 ${
										alignment === value ? "bg-white/25" : ""
									}`}
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => updateAttributes({ align: value })}
									title={title}
								>
									<Icon className="size-4" />
								</button>
							))}
							<span className="mx-0.5 h-5 w-px bg-white/25" />
							<button
								type="button"
								className="flex size-7 items-center justify-center rounded-sm hover:bg-destructive"
								onMouseDown={(event) => event.preventDefault()}
								onClick={deleteNode}
								title="이미지 삭제"
							>
								<Trash2 className="size-4" />
							</button>
						</div>
						<button
							type="button"
							aria-label="이미지 크기 조절"
							className="absolute -bottom-2 -right-2 size-5 touch-none cursor-nwse-resize rounded-sm border-2 border-background bg-primary shadow"
							onPointerDown={(event) => {
								event.preventDefault();
								event.currentTarget.setPointerCapture(event.pointerId);
								const editorWidth =
									event.currentTarget.closest(".ProseMirror")?.clientWidth ??
									BUILD_IMAGE_MAX_WIDTH;
								resizeRef.current = {
									maxWidth: Math.min(editorWidth, BUILD_IMAGE_MAX_WIDTH),
									startWidth: previewWidth,
									startX: event.clientX,
								};
							}}
							onPointerMove={(event) => {
								const resize = resizeRef.current;
								if (!resize) return;

								const nextWidth =
									resize.startWidth + event.clientX - resize.startX;
								const width = Math.min(
									resize.maxWidth,
									Math.max(
										Math.min(BUILD_IMAGE_MIN_WIDTH, resize.maxWidth),
										nextWidth,
									),
								);
								previewWidthRef.current = width;
								setPreviewWidth(width);
							}}
							onPointerUp={finishResize}
							onPointerCancel={finishResize}
						/>
					</>
				)}
			</div>
		</NodeViewWrapper>
	);
};

export const BuildImage = TiptapNode.create({
	name: "buildImage",
	group: "block",
	atom: true,
	draggable: true,

	addAttributes() {
		return {
			src: { default: null },
			alt: { default: "" },
			align: {
				default: "left",
				parseHTML: (element) =>
					normalizeAlignment(element.getAttribute("data-align")),
				renderHTML: (attributes) => ({
					"data-align": normalizeAlignment(attributes.align),
				}),
			},
			storagePath: {
				default: null,
				parseHTML: (element) => element.getAttribute("data-storage-path"),
				renderHTML: (attributes) => ({
					"data-storage-path": attributes.storagePath,
				}),
			},
			width: {
				default: 720,
				parseHTML: (element) => normalizeWidth(element.getAttribute("width")),
				renderHTML: (attributes) => ({
					width: normalizeWidth(attributes.width),
				}),
			},
		};
	},

	parseHTML() {
		return [{ tag: 'img[data-build-image="true"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"img",
			mergeAttributes(HTMLAttributes, {
				"data-build-image": "true",
				decoding: "async",
				loading: "lazy",
			}),
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(BuildImageNodeView);
	},
});
