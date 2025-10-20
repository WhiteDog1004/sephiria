import type { Database } from "@/types_db";

export type GetBuildsParams = {
	page?: number;
	limit?: number;
	isLatestVersion?: boolean;
} & Partial<Pick<BuildRow, "title" | "costume" | "weapon" | "miracle">>;

export type BuildRow = Database["public"]["Tables"]["builds"]["Row"];

export type GetBuildsResponse = {
	data: BuildRow[];
	count: number | null;
};
