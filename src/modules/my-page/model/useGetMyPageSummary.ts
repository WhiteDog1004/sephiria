import { useQuery } from "@tanstack/react-query";
import type { WriterBuildStatsRow } from "@/src/entities/builds/model/builds.types";

type MyPageSummary = {
	buildCount: number;
	badgeLevel: WriterBuildStatsRow["badge_level"];
};

const getMyPageSummary = async (): Promise<MyPageSummary> => {
	const response = await fetch("/api/my-page/summary", {
		method: "GET",
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(json?.message ?? "Failed to fetch my page summary");
	}

	return json as MyPageSummary;
};

export const useGetMyPageSummary = () => {
	return useQuery({
		queryKey: ["my-page", "summary"],
		queryFn: getMyPageSummary,
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
};
