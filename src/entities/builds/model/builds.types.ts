import type { Database } from "@/types_db";

export type GetBuildsParams = {
	page?: number;
	limit?: number;
	like: "asc" | "desc";
	isLatestVersion?: boolean;
	isWriter?: boolean;
	recentDays?: 7 | 30;
	writerUuid?: string;
	likedOnly?: boolean;
	presetCodeOnly?: boolean;
	likedByUserId?: string;
	viewerId?: string;
	combo?: string;
	artifacts?: string[];
} & Partial<Pick<BuildRow, "title" | "costume" | "weapon" | "miracle">>;

export type BuildRow = Database["public"]["Tables"]["builds"]["Row"];
export type WriterBuildStatsRow =
	Database["public"]["Tables"]["writer_build_stats"]["Row"];

export type BuildWithLikeStatus = BuildRow & {
	isLiked?: boolean;
	writerStats?: Pick<
		WriterBuildStatsRow,
		"build_count" | "badge_level" | "nickname_color"
	>;
};

export type GetBuildsResponse = {
	data: BuildWithLikeStatus[];
	count: number | null;
};
