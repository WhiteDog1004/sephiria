import type { Dispatch, SetStateAction } from "react";

type HandleSlotNumberTypes = {
	slotNum: number;
	setSlotNum: Dispatch<SetStateAction<number>>;
	type: "minus" | "plus";
};

export const handleSlotNumber = ({
	slotNum,
	setSlotNum,
	type,
}: HandleSlotNumberTypes) => {
	if (type === "minus") {
		if (slotNum <= 18) return;

		return setSlotNum(slotNum - 1);
	}

	if (type === "plus") {
		if (slotNum >= 60) return;

		return setSlotNum(slotNum + 1);
	}
};
