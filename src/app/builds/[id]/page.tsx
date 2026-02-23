import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getBuildDetail } from "@/src/entities/build-detail";
import { BuildDetailClientPage } from "@/src/modules/build-detail";
import { COSTUMES } from "@/src/shared";

const getBuildDetailCached = cache(async (id: string) =>
	getBuildDetail({ id }),
);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const { data } = await getBuildDetailCached(id);
	if (!data) {
		return {
			title: "세피리아 위키",
			description:
				"액션 로그라이트 '세피리아(Sephiria)'의 모든 것! 코스튬, 무기, 아티팩트 등 상세한 게임 정보를 제공합니다. 나만의 강력한 빌드를 공유하고 다양한 유저들의 빌드도 확인해 보세요.",
		};
	}

	return {
		title: `${data.title} - 세피리아 위키`,
		description: `${COSTUMES[data.costume].name} 코스튬 빌드 & v${data.version} - 세피리아 위키`,
		alternates: {
			canonical: `/builds/${id}`,
		},
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			title: `${data.title} - 세피리아 위키`,
			description: `${COSTUMES[data.costume].name} 코스튬 빌드 & v${data.version} - 세피리아 위키`,
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
