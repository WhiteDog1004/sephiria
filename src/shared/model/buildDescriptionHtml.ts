import sanitizeHtml from "sanitize-html";
import { buildDescriptionEmoteItems } from "@/src/shared/config/emotes";
import {
	BUILD_IMAGE_MAX_WIDTH,
	BUILD_IMAGE_MIN_WIDTH,
	extractBuildImageStoragePaths,
	isAllowedBuildImageSource,
} from "@/src/shared/model/buildImage";

const colorStylePatterns = [
	/^#[0-9a-fA-F]{6}$/,
	/^rgb\(\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*\)$/,
	/^rgba\(\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/,
];

const allowedStyles = {
	"*": {
		color: colorStylePatterns,
		"background-color": colorStylePatterns,
		"font-size": [/^(12|14|16|18|20|24|28)px$/],
	},
};

const allowedTags = [
	"blockquote",
	"br",
	"code",
	"em",
	"h2",
	"h3",
	"h4",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"s",
	"span",
	"strong",
	"u",
	"ul",
	"mark",
];
const allowedEmoteSources = new Set(
	buildDescriptionEmoteItems.map((emote) => emote.src),
);
const allowedBuildImageAlignments = new Set(["left", "center", "right"]);

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

const plainTextToHtml = (value: string) =>
	value
		.split(/\r?\n/)
		.map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<p><br /></p>"))
		.join("");
type SanitizeBuildDescriptionOptions = {
	postUuid?: string;
	userId?: string;
};

const isAllowedBuildImageWidth = (width?: string) => {
	if (!width || !/^\d{3,4}$/.test(width)) return false;

	const numericWidth = Number(width);
	return (
		numericWidth >= BUILD_IMAGE_MIN_WIDTH &&
		numericWidth <= BUILD_IMAGE_MAX_WIDTH
	);
};

export const sanitizeBuildDescriptionHtml = (
	value?: string | null,
	options: SanitizeBuildDescriptionOptions = {},
) => {
	const source = value?.trim() ?? "";

	if (!source) return "";

	return sanitizeHtml(hasHtmlTag(source) ? source : plainTextToHtml(source), {
		allowedTags,
		allowedAttributes: {
			"*": ["style"],
			img: [
				"src",
				"alt",
				"title",
				"width",
				"loading",
				"decoding",
				"data-emote",
				"data-build-image",
				"data-storage-path",
				"data-align",
			],
		},
		allowedStyles,
		allowedSchemes: ["http", "https", "mailto"],
		disallowedTagsMode: "discard",
		enforceHtmlBoundary: true,
		exclusiveFilter: (frame) => {
			if (frame.tag !== "img") return false;

			if (frame.attribs["data-emote"] === "true") {
				return !allowedEmoteSources.has(frame.attribs.src);
			}

			if (frame.attribs["data-build-image"] !== "true") return true;

			const alignment = frame.attribs["data-align"];

			return !(
				isAllowedBuildImageSource(
					frame.attribs.src,
					frame.attribs["data-storage-path"],
					options,
				) &&
				isAllowedBuildImageWidth(frame.attribs.width) &&
				(!alignment || allowedBuildImageAlignments.has(alignment))
			);
		},
	});
};

export const stripBuildDescriptionHtml = (value?: string | null) =>
	sanitizeHtml(value ?? "", {
		allowedTags: [],
		allowedAttributes: {},
	});

export { extractBuildImageStoragePaths };
