import type { MiracleReq } from "../model/types";
import type { MiracleRow } from "../model/types";
import miraclesJson from "../model/miracles.json";

const getMiracleRows = () => {
	return miraclesJson as MiracleRow[];
};

export const getMiracle = async ({ miracle }: MiracleReq): Promise<MiracleRow> => {
	const data = getMiracleRows().find((item) => item.value === miracle);
	if (!data) {
		throw new Error("Miracle not found");
	}

	return data;
};

export const getMiracleDatas = async () => {
	return getMiracleRows().sort((a, b) => a.id - b.id);
};

export const getClientMiracleDatas = async () => {
	return getMiracleDatas();
};
