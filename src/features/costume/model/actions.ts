import type { CostumeRow } from "@/src/entities/costume/model/costume.types";
import costumesJson from "@/src/entities/costume/model/costumes.json";

const getCostumeRows = () => {
	return costumesJson as CostumeRow[];
};

export const getDetailList = async () => {
	return getCostumeRows().sort((a, b) => a.id - b.id);
};
