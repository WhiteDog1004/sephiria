import { notFound } from "next/navigation";
import { getBuildDetailCached } from "@/src/entities/builds/api/buildsCache";

type BuildDetailProps = {
	id: string;
};

const handleError = (hasError: boolean) => {
	if (hasError) {
		return notFound();
	}
};

export const getBuildDetail = async ({ id }: BuildDetailProps) => {
	const { data } = await getBuildDetailCached(id);
	handleError(!data);

	return { data };
};
