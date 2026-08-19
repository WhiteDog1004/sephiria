export type CreateBuildLikeTypes = {
	postUuid: string;
	userId: string;
};

export type BuildLikeResponse = CreateBuildLikeTypes & {
	postLike: number;
};
