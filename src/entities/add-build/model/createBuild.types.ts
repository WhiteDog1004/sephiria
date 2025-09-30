// Talent 타입
export type TalentType = {
	anger: number;
	rapid: number;
	survival: number;
	patience: number;
	wisdom: number;
	will: number;
};

// 리스트 아이템 타입
export type ListItemType = {
	id: string;
	value: string;
};

// 리스트 타입
export type ListType = {
	items: ListItemType[];
	label: string;
	description?: string;
};

export type WriterType = {
	uuid: string;
	nickname: string;
	profileImage: string | null;
};

export type CreateBuildType = {
	title: string;
	description: string;
	content: ListType[];
	costume: string;
	weapon: string;
	miracle: string;
	ability: TalentType;
	writer: WriterType;
	youtube_link?: string;
	version?: string;
	postLike?: number;
	postUuid: string;
};

export type PostBuildType = {
	title: string;
	description: string;
	lists: ListType[];
	costume: string;
	weapon: string;
	miracle: string;
	talent: TalentType;
	writer: WriterType;
	youtube_link?: string;
	version?: string;
	postLike?: number;
	postUuid: string;
};
