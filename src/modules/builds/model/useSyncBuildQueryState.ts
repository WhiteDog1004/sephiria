"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type RefObject, useEffect } from "react";

interface UseSyncBuildQueryStateProps {
	page: number;
	setPage: (v: number) => void;
	isAscending?: boolean;
	setIsAscending: (v: boolean) => void;
	isLatestVersion: boolean;
	setIsLatestVersion: (v: boolean) => void;
	searchList: Record<string, any>;
	setSearchList: (v: Record<string, any>) => void;
	refetch: () => void;
	resetRef: RefObject<boolean>;
}

export const useSyncBuildQueryState = ({
	resetRef,
	page,
	setPage,
	isAscending,
	setIsAscending,
	isLatestVersion,
	setIsLatestVersion,
	searchList,
	setSearchList,
	refetch,
}: UseSyncBuildQueryStateProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
	useEffect(() => {
		const urlPage = Number(searchParams.get("page")) || 1;
		const urlAsc = searchParams.get("like") === "asc";
		const urlLatest = searchParams.get("latest") === "true";

		const urlSearchList: Record<string, string> = {};
		["title", "costume", "weapon", "miracle"].forEach((key) => {
			const val = searchParams.get(key);
			if (val) urlSearchList[key] = val;
		});

		setPage(urlPage);
		setIsAscending(urlAsc);
		setIsLatestVersion(urlLatest);
		setSearchList(urlSearchList);

		refetch();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
	useEffect(() => {
		if (resetRef.current) return;

		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));
		params.set("like", isAscending ? "asc" : "desc");
		params.set("latest", String(isLatestVersion));

		Object.entries(searchList).forEach(([key, value]) => {
			if (value) params.set(key, value);
			else params.delete(key);
		});

		router.replace(`${pathname}?${params.toString()}`);
		refetch();
	}, [page, isAscending, isLatestVersion, searchList]);
};
