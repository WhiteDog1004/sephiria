export const getTierBorderColor = (tier: string, isLightMode?: boolean) => {
	switch (tier) {
		case "common":
			return "";
		case "advanced":
			return isLightMode ? "!border-blue-500" : "!border-blue-300";
		case "rare":
			return isLightMode ? "!border-yellow-600" : "!border-yellow-300";
		case "legend":
			return "!border-pink-500";
		default:
			return "!border-white";
	}
};
