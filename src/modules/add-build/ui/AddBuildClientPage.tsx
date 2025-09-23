"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
	AddTitle,
	SelectCostume,
	SelectTalent,
	SelectWeapon,
} from "@/src/features/add-build";
import { Button, Column, Form, Row, Typography } from "@/src/shared";
import { addFormSchema } from "../model/formSchema";

export const AddBuildClientPage = () => {
	const form = useForm({
		resolver: zodResolver(addFormSchema),
		defaultValues: {
			title: "",
			costume: "",
			weapon: "",
			talent: {
				anger: 0,
				rapid: 0,
				survival: 0,
				patience: 0,
				wisdom: 0,
				will: 0,
			},
		},
		mode: "onChange",
	});

	const onSubmit = (value: any) => {
		console.log(value);
	};

	return (
		<Column className="w-full p-8 items-center">
			<Image src="/white-wolf.png" alt="white-wolf" width={120} height={120} />
			<Column className="w-full max-w-7xl p-4 mx-auto border rounded-lg justify-center items-center gap-4">
				<Column className="items-center py-4">
					<Typography variant="header1">빌드 공유소</Typography>
					<Typography className="text-secondary-foreground" variant="body2">
						다른 용사님들께 빌드를 공유해 보세요!
					</Typography>
				</Column>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-8 w-full max-w-3xl"
					>
						<AddTitle {...form} />
						<Row className="gap-2">
							<SelectCostume {...form} />
							<SelectWeapon {...form} />
						</Row>

						<SelectTalent {...form} />

						<Button size="lg" className="w-full" type="submit">
							작성
						</Button>
					</form>
				</Form>
			</Column>
		</Column>
	);
};
