import { create } from "zustand";

export interface BuildSearchState {
	searchList: {
		isWriter?: boolean;
		title?: string;
		costume?: string;
		weapon?: string;
		miracle?: string;
	};
	isAscending: boolean;
	isLatestVersion: boolean;
	page: number;

	setSearchList: (q: BuildSearchState["searchList"]) => void;
	setIsAscending: (asc: boolean) => void;
	setIsLatestVersion: (v: boolean) => void;
	setPage: (p: number) => void;
}

export const useBuildSearchStore = create<BuildSearchState>((set) => ({
	searchList: {},
	isAscending: false,
	isLatestVersion: false,
	page: 1,

	setSearchList: (searchList) => set({ searchList }),
	setIsAscending: (asc) => set({ isAscending: asc }),
	setIsLatestVersion: (v) => set({ isLatestVersion: v }),
	setPage: (p) => set({ page: p }),
}));
