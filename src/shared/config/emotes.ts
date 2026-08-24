export const buildDescriptionEmotes = [
	"1-112.gif",
	"2-112.png",
	"3-112.gif",
	"4-112.png",
	"5-112.png",
	"6-112.png",
	"7-112.png",
	"8-112.png",
	"9-112.gif",
	"10-112.png",
	"11-112.png",
	"12-112.png",
	"13-112.png",
	"14-112.png",
	"15-112.gif",
	"16-112.png",
	"17-112.png",
	"18-112.png",
	"19-112.gif",
	"20-112.png",
	"21-112.png",
	"22-112.png",
	"23-112.png",
	"24-112.png",
	"25-112.png",
	"26-112.png",
	"27-112.png",
	"28-112.png",
	"29-112.png",
	"30-112.png",
	"31-112.png",
	"32-112.png",
] as const;

export const buildDescriptionEmoteItems = buildDescriptionEmotes.map((file) => {
	const label = `Emote ${file.split("-")[0]}`;

	return {
		src: `/emotes/${file}`,
		label,
	};
});
