import { z } from "zod";
import {
	FRUIT_SKEWER_MAX_POINTS,
	FRUIT_SKEWER_SPECIAL_KEY,
} from "@/src/features/add-build/config/fruitSkewer";

export const addFormSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "제목을 입력해 주세요",
		})
		.max(80, {
			message: "80자 내로 입력해 주세요",
		}),
	description: z.string().max(2000, { message: "2000자 내로 입력해 주세요" }),
	costume: z.string().min(1, { message: "코스튬을 선택해 주세요" }),
	weapon: z.string().min(1, { message: "무기를 선택해 주세요" }),
	miracle: z.string().min(1, { message: "기적을 선택해 주세요" }),
	combo: z.array(z.string()).max(2, { message: "핵심 콤보는 최대 2개입니다" }),
	fruit_skewer: z
		.array(
			z.object({
				key: z.string().min(1, { message: "효과를 선택해 주세요" }),
				value: z
					.number()
					.int()
					.min(-2, { message: "수치는 -2 이상이어야 합니다" })
					.max(3, { message: "수치는 +3 이하여야 합니다" })
					.refine((value) => value !== 0, {
						message: "수치는 0을 선택할 수 없습니다",
					}),
			}),
		)
		.refine(
			(list) =>
				list.every((item) =>
					item.key === FRUIT_SKEWER_SPECIAL_KEY ? item.value === 1 : true,
				),
			{ message: "적응형 드롭 보너스는 +1만 선택할 수 있습니다" },
		)
		.refine(
			(list) =>
				list.reduce((total, item) => total + Math.abs(item.value), 0) <=
				FRUIT_SKEWER_MAX_POINTS,
			{ message: `수치 절대값 합은 최대 ${FRUIT_SKEWER_MAX_POINTS}까지 가능합니다` },
		)
		.refine((list) => new Set(list.map((item) => item.key)).size === list.length, {
			message: "동일한 효과를 중복으로 선택할 수 없습니다",
		}),
	talent: z
		.object({
			anger: z.number().min(0).max(20),
			rapid: z.number().min(0).max(20),
			survival: z.number().min(0).max(20),
			patience: z.number().min(0).max(20),
			wisdom: z.number().min(0).max(20),
			will: z.number().min(0).max(20),
			base: z.number().min(0).max(20),
		})
		.refine(
			(talent) => {
				const total =
					talent.anger +
					talent.rapid +
					talent.survival +
					talent.patience +
					talent.wisdom +
					talent.will +
					talent.base;
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
				.max(300, { message: "최대 300글자까지 입력 가능합니다" })
				.optional(),
		}),
	),
});
