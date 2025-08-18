export const renderStar = (count: number) => {
	if (count <= 0) {
		return "";
	}
	return "★".repeat(count);
};
