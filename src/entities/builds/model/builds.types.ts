import type { Database } from "@/types_db";

export type GetBuildsParams = {
	page?: number;
	limit?: number;
	like: "asc" | "desc";
	isLatestVersion?: boolean;
	isWriter?: boolean;
	writerUuid?: string;
	likedOnly?: boolean;
	likedByUserId?: string;
	viewerId?: string;
	combo?: string;
} & Partial<Pick<BuildRow, "title" | "costume" | "weapon" | "miracle">>;

export type BuildRow = Database["public"]["Tables"]["builds"]["Row"];

export type BuildWithLikeStatus = BuildRow & {
	isLiked?: boolean;
};

export type GetBuildsResponse = {
	data: BuildWithLikeStatus[];
	count: number | null;
};
