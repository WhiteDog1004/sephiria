import type { BuildRow } from "@/src/entities/builds/model/builds.types";

export type AdminBuildImage = {
	src: string;
	storagePath: string;
};

export type AdminImageBuild = {
	createdAt: string;
	images: AdminBuildImage[];
	postUuid: string;
	title: string;
	updatedAt: string | null;
	writer: BuildRow["writer"];
};

export type AdminImagesResponse = {
	count: number;
	data: AdminImageBuild[];
	page: number;
	pageSize: number;
};
