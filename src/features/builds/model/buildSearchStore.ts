import { create } from "zustand";

interface BuildSearchState {
	searchList: {
		title?: string;
		costume?: string;
		weapon?: string;
		miracle?: string;
		like?: string;
	};
	setSearchList: (q: BuildSearchState["searchList"]) => void;
}

export const useBuildSearchStore = create<BuildSearchState>((set) => ({
	searchList: {},
	setSearchList: (searchList) => set({ searchList }),
}));
