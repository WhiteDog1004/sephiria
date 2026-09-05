import { create } from "zustand";

export interface BuildSearchState {
	searchList: {
		isWriter?: boolean;
		writerUuid?: string;
		title?: string;
		costume?: string;
		weapon?: string;
		miracle?: string;
		combo?: string;
		artifacts?: string[];
	};
	isAscending: boolean;
	isLatestVersion: boolean;
	likedOnly: boolean;
	presetCodeOnly: boolean;
	recentDays?: 7 | 30;
	page: number;

	setSearchList: (q: BuildSearchState["searchList"]) => void;
	setIsAscending: (asc: boolean) => void;
	setIsLatestVersion: (v: boolean) => void;
	setLikedOnly: (v: boolean) => void;
	setPresetCodeOnly: (v: boolean) => void;
	setRecentDays: (v?: 7 | 30) => void;
	setPage: (p: number) => void;
}

export const useBuildSearchStore = create<BuildSearchState>((set) => ({
	searchList: {},
	isAscending: false,
	isLatestVersion: false,
	likedOnly: false,
	presetCodeOnly: false,
	recentDays: undefined,
	page: 1,

	setSearchList: (searchList) => set({ searchList }),
	setIsAscending: (asc) => set({ isAscending: asc }),
	setIsLatestVersion: (v) => set({ isLatestVersion: v }),
	setLikedOnly: (v) => set({ likedOnly: v }),
	setPresetCodeOnly: (v) => set({ presetCodeOnly: v }),
	setRecentDays: (v) => set({ recentDays: v }),
	setPage: (p) => set({ page: p }),
}));
