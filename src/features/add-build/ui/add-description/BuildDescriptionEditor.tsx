"use client";

import { Extension, mergeAttributes, Node as TiptapNode } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Code,
	ImagePlus,
	Italic,
	List,
	ListOrdered,
	Loader2,
	PaintBucket,
	Quote,
	Redo2,
	Smile,
	Strikethrough,
	Type,
	UnderlineIcon,
	Undo2,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
} from "@/src/shared";
import { buildDescriptionEmoteItems } from "@/src/shared/config/emotes";
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";
import { BUILD_IMAGE_MAX_COUNT } from "@/src/shared/model/buildImage";
import { uploadBuildImage } from "../../lib/buildImageUpload";
import { BuildImage } from "./BuildImageExtension";

const FontSize = Extension.create({
	name: "fontSize",

	addGlobalAttributes() {
		return [
			{
				types: ["textStyle"],
				attributes: {
					fontSize: {
						default: null,
						parseHTML: (element) => element.style.fontSize || null,
						renderHTML: (attributes) => {
							if (!attributes.fontSize) return {};

							return {
								style: `font-size: ${attributes.fontSize}`,
							};
						},
					},
				},
			},
		];
	},
});

const EmoteImage = TiptapNode.create({
	name: "emoteImage",
	group: "inline",
	inline: true,
	atom: true,

	addAttributes() {
		return {
			src: {
				default: null,
			},
			alt: {
				default: "",
			},
			title: {
				default: "",
			},
		};
	},

	parseHTML() {
		return [{ tag: 'img[data-emote="true"]' }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"img",
			mergeAttributes(HTMLAttributes, {
				"data-emote": "true",
			}),
		];
	},
});

type BuildDescriptionEditorProps = {
	value: string;
	onImageUploaded?: (storagePath: string) => void;
	onChange: (value: string) => void;
	onUploadingChange?: (isUploading: boolean) => void;
	postUuid: string;
	userId: string;
};

type ToolbarButtonProps = {
	active?: boolean;
	children: ReactNode;
	disabled?: boolean;
	onClick: () => void;
	title: string;
};

const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];
const textColors = [
	"#e5e7eb",
	"#ffffff",
	"#f87171",
	"#facc15",
	"#4ade80",
	"#60a5fa",
	"#c084fc",
	"#f472b6",
];
const backgroundColors = [
	"#000000",
	"#1f2937",
	"#7f1d1d",
	"#713f12",
	"#14532d",
	"#1e3a8a",
	"#581c87",
	"#831843",
];
const emotesPerPage = 16;
const ToolbarButton = ({
	active,
	children,
	disabled,
	onClick,
	title,
}: ToolbarButtonProps) => (
	<Button
		type="button"
		size="icon"
		variant="ghost"
		className={cn(
			"size-8 rounded-sm border-0 shadow-none",
			active && "bg-accent text-accent-foreground",
		)}
		disabled={disabled}
		onClick={onClick}
		title={title}
	>
		{children}
	</Button>
);

const ToolbarDivider = () => <span className="mx-1 h-5 w-px bg-border" />;

const FontSizePopover = ({
	onSelect,
	value,
}: {
	onSelect: (fontSize: string) => void;
	value: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="h-8 w-16 justify-between gap-1 rounded-sm border-0 bg-accent/50 px-2 text-xs shadow-none"
					onMouseDown={(event) => event.preventDefault()}
					title="텍스트 크기"
				>
					{value.replace("px", "")}
					<ChevronDown className="size-3 opacity-60" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-16 p-1">
				{fontSizes.map((fontSize) => (
					<button
						key={fontSize}
						type="button"
						className={cn(
							"flex h-7 w-full items-center rounded-sm px-2 text-xs hover:bg-accent",
							value === fontSize && "bg-accent text-accent-foreground",
						)}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => {
							onSelect(fontSize);
							setOpen(false);
						}}
					>
						{fontSize.replace("px", "")}
					</button>
				))}
			</PopoverContent>
		</Popover>
	);
};

const ColorPopover = ({
	colors,
	icon,
	onClear,
	onSelect,
	title,
}: {
	colors: string[];
	icon: ReactNode;
	onClear: () => void;
	onSelect: (color: string) => void;
	title: string;
}) => (
	<Popover>
		<PopoverTrigger asChild>
			<Button
				type="button"
				variant="ghost"
				className="h-8 gap-1 rounded-sm border-0 px-2 shadow-none"
				title={title}
			>
				{icon}
				<ChevronDown className="size-3 opacity-60" />
			</Button>
		</PopoverTrigger>
		<PopoverContent align="start" className="w-max p-2">
			<div className="grid grid-cols-4 gap-1">
				{colors.map((color) => (
					<button
						key={color}
						type="button"
						className="size-6 rounded-sm border border-border"
						style={{ backgroundColor: color }}
						onClick={() => onSelect(color)}
						title={color}
					/>
				))}
			</div>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="mt-2 h-7 w-full text-xs"
				onClick={onClear}
			>
				초기화
			</Button>
		</PopoverContent>
	</Popover>
);

const EmotePopover = ({
	onSelect,
}: {
	onSelect: (emote: (typeof buildDescriptionEmoteItems)[number]) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(0);
	const totalPages = Math.ceil(
		buildDescriptionEmoteItems.length / emotesPerPage,
	);
	const visibleEmotes = buildDescriptionEmoteItems.slice(
		page * emotesPerPage,
		(page + 1) * emotesPerPage,
	);

	return (
		<Popover
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (open) setPage(0);
			}}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="h-8 gap-1 rounded-sm border-0 px-2 shadow-none"
					onMouseDown={(event) => event.preventDefault()}
					title="Emote"
				>
					<Smile className="size-4" />
					<ChevronDown className="size-3 opacity-60" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-48 p-2">
				<div className="grid grid-cols-4 gap-1">
					{visibleEmotes.map((emote) => (
						<button
							key={emote.src}
							type="button"
							className="flex size-10 items-center justify-center rounded-sm hover:bg-accent"
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => {
								onSelect(emote);
								setOpen(false);
							}}
							title={emote.label}
						>
							<Image
								src={emote.src}
								alt={emote.label}
								width={28}
								height={28}
								className="pixelated"
								unoptimized
							/>
						</button>
					))}
				</div>
				<div className="mt-2 flex items-center justify-between border-t pt-2">
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-7 rounded-sm"
						disabled={page === 0}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => setPage((page) => Math.max(page - 1, 0))}
						title="Previous emotes"
					>
						<ChevronLeft className="size-4" />
					</Button>
					<span className="text-xs text-muted-foreground">
						{page + 1}/{totalPages}
					</span>
					<Button
						type="button"
						size="icon"
						variant="ghost"
						className="size-7 rounded-sm"
						disabled={page >= totalPages - 1}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() =>
							setPage((page) => Math.min(page + 1, totalPages - 1))
						}
						title="Next emotes"
					>
						<ChevronRight className="size-4" />
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export const BuildDescriptionEditor = ({
	value,
	onImageUploaded,
	onChange,
	onUploadingChange,
	postUuid,
	userId,
}: BuildDescriptionEditorProps) => {
	const lastEmittedHtmlRef = useRef(value);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const uploadFilesRef = useRef<(files: File[]) => void>(() => undefined);
	const uploadInProgressRef = useRef(false);
	const [selectedFontSize, setSelectedFontSize] = useState("14px");
	const [imageError, setImageError] = useState("");
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			FontSize,
			EmoteImage,
			BuildImage,
			Color,
			Highlight.configure({ multicolor: true }),
			Underline,
		],
		content: sanitizeBuildDescriptionHtml(value),
		editorProps: {
			attributes: {
				class:
					"min-h-52 max-h-96 overflow-y-auto rounded-b-lg border-x border-b dark:bg-white/5 bg-black/5 px-3 py-3 text-sm outline-none [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_img[data-emote='true']]:mx-1 [&_img[data-emote='true']]:inline-block [&_img[data-emote='true']]:size-28 [&_img[data-emote='true']]:align-middle [&_img[data-emote='true']]:[image-rendering:pixelated] [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:rounded-md [&_pre]:bg-secondary [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5",
			},
			handlePaste: (_view, event) => {
				const items = [...(event.clipboardData?.items ?? [])];
				const files = items
					.filter((item) => item.type.startsWith("image/"))
					.map((item) => item.getAsFile())
					.filter((file): file is File => Boolean(file));

				if (files.length === 0) return false;
				uploadFilesRef.current(files);
				return true;
			},
			handleDrop: (_view, event) => {
				const files = [...(event.dataTransfer?.files ?? [])].filter((file) =>
					file.type.startsWith("image/"),
				);

				if (files.length === 0) return false;
				uploadFilesRef.current(files);
				return true;
			},
		},
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			lastEmittedHtmlRef.current = html;
			onChange(html);
		},
	});

	const uploadFiles = async (files: File[]) => {
		if (!editor || uploadInProgressRef.current) return;
		if (!postUuid || !userId) {
			setImageError("로그인 정보를 확인한 뒤 다시 시도해 주세요.");
			return;
		}

		let currentImageCount = 0;
		editor.state.doc.descendants((node) => {
			if (node.type.name === "buildImage") currentImageCount += 1;
		});

		const availableCount = BUILD_IMAGE_MAX_COUNT - currentImageCount;
		if (availableCount <= 0) {
			setImageError(
				`이미지는 최대 ${BUILD_IMAGE_MAX_COUNT}장까지 첨부할 수 있습니다.`,
			);
			return;
		}

		const imageFiles = files.slice(0, availableCount);
		setImageError(
			files.length > availableCount
				? `최대 ${BUILD_IMAGE_MAX_COUNT}장까지만 첨부했습니다.`
				: "",
		);
		uploadInProgressRef.current = true;
		setIsUploadingImage(true);
		onUploadingChange?.(true);

		try {
			for (const file of imageFiles) {
				const image = await uploadBuildImage({ file, postUuid, userId });
				onImageUploaded?.(image.storagePath);
				editor
					.chain()
					.focus()
					.insertContent({
						type: "buildImage",
						attrs: {
							align: "left",
							alt: image.alt,
							src: image.src,
							storagePath: image.storagePath,
							width: Math.min(image.width, 720),
						},
					})
					.run();
			}
		} catch (error) {
			setImageError(
				error instanceof Error
					? error.message
					: "이미지 업로드 중 오류가 발생했습니다.",
			);
		} finally {
			uploadInProgressRef.current = false;
			setIsUploadingImage(false);
			onUploadingChange?.(false);
		}
	};

	uploadFilesRef.current = (files) => {
		void uploadFiles(files);
	};

	useEffect(() => {
		if (!editor) return;
		if (value === lastEmittedHtmlRef.current) return;

		const sanitizedValue = sanitizeBuildDescriptionHtml(value);
		if (sanitizedValue !== editor.getHTML()) {
			editor.commands.setContent(sanitizedValue, { emitUpdate: false });
			lastEmittedHtmlRef.current = sanitizedValue;
		}
	}, [editor, value]);

	useEffect(() => {
		if (!editor) return;

		const syncSelectedFontSize = () => {
			setSelectedFontSize(editor.getAttributes("textStyle").fontSize || "14px");
		};

		editor.on("selectionUpdate", syncSelectedFontSize);

		return () => {
			editor.off("selectionUpdate", syncSelectedFontSize);
		};
	}, [editor]);

	if (!editor) {
		return <div className="min-h-52 rounded-lg border bg-background" />;
	}

	return (
		<div className="w-full">
			<input
				ref={imageInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				multiple
				className="hidden"
				onChange={(event) => {
					void uploadFiles([...(event.target.files ?? [])]);
					event.target.value = "";
				}}
			/>
			<Row className="w-full items-center gap-0 overflow-x-auto rounded-t-lg border bg-secondary/50 p-1.5">
				<FontSizePopover
					value={selectedFontSize}
					onSelect={(value) => {
						setSelectedFontSize(value);
						editor
							.chain()
							.focus()
							.setMark("textStyle", { fontSize: value })
							.run();
					}}
				/>
				<ToolbarDivider />
				<ToolbarButton
					active={editor.isActive("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}
					title="굵게"
				>
					<Bold />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					title="기울임"
				>
					<Italic />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("underline")}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					title="밑줄"
				>
					<UnderlineIcon />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("strike")}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					title="취소선"
				>
					<Strikethrough />
				</ToolbarButton>
				<ToolbarDivider />
				<ColorPopover
					colors={textColors}
					icon={<Type className="size-4" />}
					onClear={() => editor.chain().focus().unsetColor().run()}
					onSelect={(color) => editor.chain().focus().setColor(color).run()}
					title="텍스트 색상"
				/>
				<ColorPopover
					colors={backgroundColors}
					icon={<PaintBucket className="size-4" />}
					onClear={() => editor.chain().focus().unsetHighlight().run()}
					onSelect={(color) =>
						editor.chain().focus().toggleHighlight({ color }).run()
					}
					title="배경색"
				/>
				<ToolbarDivider />
				<EmotePopover
					onSelect={(emote) =>
						editor
							.chain()
							.focus()
							.insertContent({
								type: "emoteImage",
								attrs: {
									src: emote.src,
									alt: emote.label,
									title: emote.label,
								},
							})
							.run()
					}
				/>
				<ToolbarButton
					disabled={isUploadingImage || !postUuid || !userId}
					onClick={() => imageInputRef.current?.click()}
					title="이미지 첨부"
				>
					{isUploadingImage ? (
						<Loader2 className="animate-spin" />
					) : (
						<ImagePlus />
					)}
				</ToolbarButton>
				<ToolbarDivider />
				<ToolbarButton
					active={editor.isActive("bulletList")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					title="목록"
				>
					<List />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("orderedList")}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					title="번호 목록"
				>
					<ListOrdered />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("blockquote")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					title="인용"
				>
					<Quote />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("codeBlock")}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					title="코드 블록"
				>
					<Code />
				</ToolbarButton>
				<ToolbarDivider />
				<ToolbarButton
					disabled={!editor.can().undo()}
					onClick={() => editor.chain().focus().undo().run()}
					title="실행 취소"
				>
					<Undo2 />
				</ToolbarButton>
				<ToolbarButton
					disabled={!editor.can().redo()}
					onClick={() => editor.chain().focus().redo().run()}
					title="다시 실행"
				>
					<Redo2 />
				</ToolbarButton>
			</Row>
			<EditorContent editor={editor} />
			{imageError && (
				<p className="mt-1 text-xs text-destructive" role="alert">
					{imageError}
				</p>
			)}
		</div>
	);
};
