import sanitizeHtml from "sanitize-html";

const allowedStyles = {
	"*": {
		color: [/^#[0-9a-fA-F]{6}$/],
		"background-color": [/^#[0-9a-fA-F]{6}$/],
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

export const sanitizeBuildDescriptionHtml = (value?: string | null) => {
	const source = value?.trim() ?? "";

	if (!source) return "";

	return sanitizeHtml(hasHtmlTag(source) ? source : plainTextToHtml(source), {
		allowedTags,
		allowedAttributes: {
			"*": ["style"],
		},
		allowedStyles,
		allowedSchemes: ["http", "https", "mailto"],
		disallowedTagsMode: "discard",
		enforceHtmlBoundary: true,
	});
};

export const stripBuildDescriptionHtml = (value?: string | null) =>
	sanitizeHtml(value ?? "", {
		allowedTags: [],
		allowedAttributes: {},
	});
