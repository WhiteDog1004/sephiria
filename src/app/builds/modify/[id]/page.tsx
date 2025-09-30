import type { Metadata } from "next";
import NotFound from "@/src/app/not-found";
import { getBuildDetail } from "@/src/entities/build-detail";
import { AddBuildClientPage } from "@/src/modules/add-build";
import { SITE_METADATA } from "@/src/shared";
import { getServerLoginInfo } from "@/src/shared/api";

export const metadata: Metadata = {
	...SITE_METADATA.builds,
};

const BuildModifyPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const { data } = await getBuildDetail({ id });
	const info = await getServerLoginInfo();

	if (data.writer.uuid !== info?.user.id) return <NotFound />;
	return <AddBuildClientPage modify={data} />;
};

export default BuildModifyPage;
