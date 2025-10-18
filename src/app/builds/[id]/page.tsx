import type { Metadata } from "next";
import { getBuildDetail } from "@/src/entities/build-detail";
import { BuildDetailClientPage } from "@/src/modules/build-detail";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const { data } = await getBuildDetail({ id });

	return {
		title: `${data.title} - 세피리아 위키`,
		description: `${data.title} - 세피리아 위키`,
		openGraph: {
			title: `${data.title} - 세피리아 위키`,
			description: `${data.title} - 세피리아 위키`,
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

const BuildsDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const { data } = await getBuildDetail({ id });
	return <BuildDetailClientPage data={data} />;
};

export default BuildsDetailPage;
