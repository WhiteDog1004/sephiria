"use client";

import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	ChevronDown,
	Code,
	Italic,
	List,
	ListOrdered,
	PaintBucket,
	Quote,
	Redo2,
	Strikethrough,
	Type,
	UnderlineIcon,
	Undo2,
} from "lucide-react";
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
import { sanitizeBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";

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

type BuildDescriptionEditorProps = {
	value: string;
	onChange: (value: string) => void;
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

export const BuildDescriptionEditor = ({
	value,
	onChange,
}: BuildDescriptionEditorProps) => {
	const lastEmittedHtmlRef = useRef(value);
	const [selectedFontSize, setSelectedFontSize] = useState("14px");
	const editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			FontSize,
			Color,
			Highlight.configure({ multicolor: true }),
			Underline,
		],
		content: sanitizeBuildDescriptionHtml(value),
		editorProps: {
			attributes: {
				class:
					"min-h-52 max-h-96 overflow-y-auto rounded-b-lg border-x border-b dark:bg-white/5 bg-black/5 px-3 py-3 text-sm outline-none [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:rounded-md [&_pre]:bg-secondary [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5",
			},
			handlePaste: (_view, event) => {
				const items = [...(event.clipboardData?.items ?? [])];
				return items.some((item) => item.type.startsWith("image/"));
			},
			handleDrop: (_view, event) => {
				const files = [...(event.dataTransfer?.files ?? [])];
				return files.some((file) => file.type.startsWith("image/"));
			},
		},
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			lastEmittedHtmlRef.current = html;
			onChange(html);
		},
	});

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
		</div>
	);
};
