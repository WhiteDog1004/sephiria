export const getItemsTierColor = (tier: string, isLightMode?: boolean) => {
	switch (tier) {
		case "common":
			return "";
		case "advanced":
			return isLightMode ? "text-blue-500" : "text-blue-300";
		case "rare":
			return isLightMode ? "text-yellow-600" : "text-yellow-300";
		case "legend":
			return "text-pink-500";
		case "solid":
			return "bg-gradient-to-b from-yellow-400 via-lime-400 to-green-500 bg-clip-text text-transparent";
		default:
			return "text-white";
	}
};
