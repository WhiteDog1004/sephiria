import type { Metadata } from "next";
import { getBuildDetail } from "@/src/entities/build-detail";
import { BuildDetailClientPage } from "@/src/modules/build-detail";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = {
	...SITE_METADATA.builds,
};

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
