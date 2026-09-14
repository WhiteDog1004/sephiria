"use client";

import { useQuery } from "@tanstack/react-query";

const getAdminStatus = async () => {
	const response = await fetch("/api/admin/me", { cache: "no-store" });
	if (!response.ok) return { isAdmin: false };

	return (await response.json()) as { isAdmin: boolean };
};

export const useAdminStatus = (userId?: string) =>
	useQuery({
		queryKey: ["admin", "status", userId],
		queryFn: getAdminStatus,
		enabled: Boolean(userId),
		staleTime: 5 * 60 * 1000,
	});
