export const getItemsTierColor = (tier: string) => {
	switch (tier) {
		case "common":
			return "text-white";
		case "advanced":
			return "text-blue-300";
		case "rare":
			return "text-yellow-300";
		case "legend":
			return "text-pink-500";
		default:
			("text-white");
	}
};
