export const getRotateValue = (dx: number, dy: number, rotation: number) => {
	switch (rotation) {
		case 1:
			return { newDx: -dy, newDy: dx };
		case 2:
			return { newDx: -dx, newDy: -dy };
		case 3:
			return { newDx: dy, newDy: -dx };
		default:
			return { newDx: dx, newDy: dy };
	}
};

export const calculateRotatedEffects = (
	baseOffsets: { dx: number; dy: number; value?: number }[],
	x: number,
	y: number,
	effects: Record<string, number>,
	item?: { rotation: number },
) => {
	baseOffsets.forEach((offset) => {
		const { newDx, newDy } = getRotateValue(
			offset.dx,
			offset.dy,
			item?.rotation ?? 0,
		);
		const targetSlotId = `${y + newDy}-${x + newDx}`;

		if (effects[targetSlotId] !== undefined) {
			effects[targetSlotId] += offset.value ?? 1;
		}
	});
};
