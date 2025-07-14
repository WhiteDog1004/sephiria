export const getArtifactLevelContent = (
	content: string,
	level: number,
): string => {
	// "10/20/30" 과 같은 패턴을 찾습니다.
	const dynamicPartRegex = /(\d+(\/\d+)*)/g;
	return content.replace(dynamicPartRegex, (match) => {
		const options = match.split("/").map(Number);
		// 레벨에 맞는 값을 선택합니다. (레벨 1 -> 인덱스 0)
		// 레벨이 옵션 개수보다 크면 마지막 값을 사용합니다.
		const index = Math.max(0, Math.min(level - 1, options.length - 1));
		return options[index]?.toString() || match;
	});
};
