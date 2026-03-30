import type { CostumeReq } from "../model/costume.types";
import type { CostumeRow } from "../model/costume.types";
import costumesJson from "../model/costumes.json";

export const getCostume = async ({ costume }: CostumeReq): Promise<CostumeRow> => {
	const data = (costumesJson as CostumeRow[]).find((item) => item.value === costume);
	if (!data) {
		throw new Error("Costume not found");
	}

	return data;
};
