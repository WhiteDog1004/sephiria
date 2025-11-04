import { create } from "zustand";

interface BuildSearchState {
	searchList: {
		title?: string;
		costume?: string;
		weapon?: string;
		miracle?: string;
	};
	isAscending?: boolean;
	setSearchList: (q: BuildSearchState["searchList"]) => void;
	setIsAscending: (asc: boolean) => void;
}

export const useBuildSearchStore = create<BuildSearchState>((set) => ({
	searchList: {},
	isAscending: false,
	setIsAscending: (asc) => set({ isAscending: asc }),
	setSearchList: (searchList) => set({ searchList }),
}));
