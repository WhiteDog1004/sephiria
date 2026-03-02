import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getBuildDetail } from "@/src/entities/build-detail";
import { BuildDetailClientPage } from "@/src/modules/build-detail";

const getBuildDetailCached = cache(async (id: string) =>
	getBuildDetail({ id }),
);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;

	return {
		title: "빌드 상세 - 세피리아 위키",
		description:
			"세피리아 빌드 상세 페이지 - 유저가 직접 등록한 빌드를 확인해 보세요!",
		alternates: {
			canonical: `/builds/${id}`,
		},
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			title: "빌드 상세 - 세피리아 위키",
			description:
				"세피리아 빌드 상세 페이지 - 유저가 직접 등록한 빌드를 확인해 보세요!",
			images: [
				{
					url: "https://sephiria.wiki/thumbnail.png",
					width: 400,
					height: 220,
					alt: "세피리아 메인 이미지",
				},
			],
		},
	};
}

export const revalidate = 3600;

const BuildsDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const { data } = await getBuildDetailCached(id);
	if (!data) {
		return notFound();
	}
	return <BuildDetailClientPage data={data} />;
};

export default BuildsDetailPage;
