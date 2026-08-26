"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type RefObject, useEffect, useRef } from "react";
import type { BuildSearchState } from "@/src/features/builds/model/buildSearchStore";

interface UseSyncBuildQueryStateProps {
	page: number;
	setPage: (v: number) => void;
	isAscending?: boolean;
	setIsAscending: (v: boolean) => void;
	isLatestVersion: boolean;
	setIsLatestVersion: (v: boolean) => void;
	likedOnly: boolean;
	setLikedOnly: (v: boolean) => void;
	searchList: BuildSearchState["searchList"];
	setSearchList: (v: BuildSearchState["searchList"]) => void;
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
	likedOnly,
	setLikedOnly,
	searchList,
	setSearchList,
}: UseSyncBuildQueryStateProps) => {
	const isMounted = useRef(false);
	const isFilterSyncMounted = useRef(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
	useEffect(() => {
		const urlPage = Number(searchParams.get("page")) || 1;
		const urlAsc = searchParams.get("like") === "asc";
		const urlLatest = searchParams.get("latest") === "true";
		const urlLikedOnly = searchParams.get("liked") === "true";

		const urlSearchList: Record<string, string | boolean | string[]> = {};
		["title", "writerUuid", "costume", "weapon", "miracle", "combo"].forEach(
			(key) => {
				const val = searchParams.get(key);
				if (val) urlSearchList[key] = val;
			},
		);
		const urlArtifacts = searchParams.getAll("artifacts");
		if (urlArtifacts.length > 0) {
			urlSearchList.artifacts = urlArtifacts;
		}

		if (searchParams.get("isWriter") === "true") {
			urlSearchList.isWriter = true;
		}

		setPage(urlPage);
		setIsAscending(urlAsc);
		setIsLatestVersion(urlLatest);
		setLikedOnly(urlLikedOnly);
		setSearchList(urlSearchList);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
	useEffect(() => {
		if (resetRef?.current) return;
		if (!isFilterSyncMounted.current) {
			isFilterSyncMounted.current = true;
			return;
		}

		const params = new URLSearchParams();
		params.set("page", searchParams.get("page") || "1");
		params.set("like", isAscending ? "asc" : "desc");
		params.set("latest", isLatestVersion ? "true" : "false");
		params.set("liked", likedOnly ? "true" : "false");

		Object.entries(searchList).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				params.delete(key);
				value.forEach((item) => params.append(key, item));
				return;
			}
			if (value) params.set(key, String(value));
		});

		router.replace(`${pathname}?${params.toString()}`);
		if (
			params.get("latest") !== searchParams.get("latest") ||
			params.get("liked") !== searchParams.get("liked")
		) {
			setPage(1);
		}
	}, [isAscending, isLatestVersion, likedOnly, searchList]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
	useEffect(() => {
		if (resetRef?.current) return;

		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}

		if (Number(searchParams.get("page")) === 1 && page === 1) return;
		if (resetRef?.current) return;

		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));
		params.set("like", isAscending ? "asc" : "desc");
		params.set("latest", isLatestVersion ? "true" : "false");
		params.set("liked", likedOnly ? "true" : "false");

		Object.entries(searchList).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				params.delete(key);
				value.forEach((item) => params.append(key, item));
				return;
			}
			if (value) params.set(key, String(value));
		});

		router.push(`${pathname}?${params.toString()}`);
	}, [page]);
};
