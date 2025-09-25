import { z } from "zod";

export const addFormSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "제목을 입력해 주세요",
		})
		.max(80, {
			message: "80자 내로 입력해 주세요",
		}),
	costume: z.string().min(1, { message: "코스튬을 선택해 주세요" }),
	weapon: z.string().min(1, { message: "무기를 선택해 주세요" }),
	talent: z
		.object({
			anger: z.number().min(0).max(20),
			rapid: z.number().min(0).max(20),
			survival: z.number().min(0).max(20),
			patience: z.number().min(0).max(20),
			wisdom: z.number().min(0).max(20),
			will: z.number().min(0).max(20),
		})
		.refine(
			(talent) => {
				const total =
					talent.anger +
					talent.rapid +
					talent.survival +
					talent.patience +
					talent.wisdom +
					talent.will;
				return total === 40;
			},
			{
				message: "포인트를 전부 사용해야 합니다",
			},
		),
	lists: z.array(
		z.object({
			items: z
				.array(
					z.object({
						id: z.string(),
						value: z.string(),
					}),
				)
				.min(1, { message: "아티팩트를 선택해 주세요" }),
			label: z
				.string()
				.min(2, { message: "최소 2글자 이상 입력해 주세요" })
				.max(50, { message: "최대 50글자까지 입력 가능합니다" }),
			description: z
				.string()
				.max(50, { message: "최대 50글자까지 입력 가능합니다" })
				.optional(),
		}),
	),
});
