const RED_KEYWORDS = ["-", "없음", "고정", "비활성"];

export const containsRedKeyword = (text: string) =>
	RED_KEYWORDS.some((keyword) => text.includes(keyword));
