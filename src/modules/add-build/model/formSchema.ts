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
	costume: z.string(),
	weapon: z.string(),
	talent: z.object({
		anger: z.number().min(0).max(20),
		rapid: z.number().min(0).max(20),
		survival: z.number().min(0).max(20),
		patience: z.number().min(0).max(20),
		wisdom: z.number().min(0).max(20),
		will: z.number().min(0).max(20),
	}),
});
