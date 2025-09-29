"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBuild } from "@/src/entities/add-build";
import type {
	CreateBuildType,
	PostBuildType,
} from "@/src/entities/add-build/model/createBuild.types";
import { useUpdateBuild } from "@/src/entities/modify-build";
import {
	AddTitle,
	SelectCostume,
	SelectMiracle,
	SelectTalent,
	SelectWeapon,
} from "@/src/features/add-build";
import { AddDescription } from "@/src/features/add-build/ui/add-description/AddDescription";
import {
	Button,
	Column,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Form,
	Row,
	SITEMAP,
	Typography,
} from "@/src/shared";
import NotLogin from "@/src/shared/components/NotLogin";
import { useSession } from "../../header/model/useUserInfo";
import { addFormSchema } from "../model/formSchema";
import { AddItems } from "./AddItems";

export const AddBuildClientPage = ({
	modify,
}: {
	modify?: CreateBuildType;
}) => {
	const router = useRouter();
	const { data: info, isSuccess } = useSession();
	const { mutate } = useCreateBuild();
	const { mutate: update } = useUpdateBuild();
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	const form = useForm({
		resolver: zodResolver(addFormSchema),
		defaultValues: {
			title: "",
			description: "",
			costume: "",
			weapon: "",
			miracle: "",
			talent: {
				anger: 0,
				rapid: 0,
				survival: 0,
				patience: 0,
				wisdom: 0,
				will: 0,
			},
			lists: [],
		},
		mode: "onChange",
	});

	const onSubmit = (value: Omit<PostBuildType, "writer" | "postUuid">) => {
		if (modify) {
			update(
				{
					postUuid: modify.postUuid,
					title: value.title,
					description: value.description,
					costume: value.costume,
					weapon: value.weapon,
					miracle: value.miracle,
					content: value.lists,
					youtube_link: value.youtube_link,
					writer: {
						uuid: info?.user.id || "",
						nickname: info?.user.user_metadata.full_name,
						profileImage: info?.user.user_metadata.avatar_url,
					},
					ability: value.talent,
				},
				{
					onSuccess: () => {
						form.reset();
						setIsSuccessOpen(true);
					},
				},
			);
		} else {
			mutate(
				{
					postUuid: crypto.randomUUID(),
					title: value.title,
					description: value.description,
					costume: value.costume,
					weapon: value.weapon,
					miracle: value.miracle,
					content: value.lists,
					youtube_link: value.youtube_link,
					writer: {
						uuid: info?.user.id || "",
						nickname: info?.user.user_metadata.full_name,
						profileImage: info?.user.user_metadata.avatar_url,
					},
					ability: value.talent,
				},
				{
					onSuccess: () => {
						form.reset();
						setIsSuccessOpen(true);
					},
				},
			);
		}
	};

	useEffect(() => {
		if (modify) {
			form.reset({
				title: modify.title,
				description: modify.description,
				costume: modify.costume,
				weapon: modify.weapon,
				miracle: modify.miracle,
				talent: modify.ability,
				lists: modify.content,
			});
		} else {
			form.reset({
				title: "",
				description: "",
				costume: "",
				weapon: "",
				miracle: "",
				talent: {
					anger: 0,
					rapid: 0,
					survival: 0,
					patience: 0,
					wisdom: 0,
					will: 0,
				},
				lists: [],
			});
		}
	}, [modify, form]);

	useEffect(() => {
		if (isSuccess && !info?.user.id) {
			return setIsLogin(false);
		}
		return setIsLogin(true);
	}, [info, isSuccess]);

	if (!isSuccess) return null;
	if (!isLogin) return <NotLogin />;
	return (
		<Column className="w-full p-2 sm:p-8 items-center">
			<Image src="/white-wolf.png" alt="white-wolf" width={120} height={120} />
			<Column className="w-full max-w-7xl p-2 sm:p-4 mx-auto border rounded-lg justify-center items-center gap-4">
				<Column className="items-center py-4">
					<Typography variant="header1">빌드 공유소</Typography>
					<Typography className="text-secondary-foreground" variant="body2">
						다른 여행자분들께 빌드를 공유해 보세요!
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
							<SelectMiracle {...form} />
						</Row>

						<SelectTalent {...form} />

						<AddItems {...form} />

						<AddDescription {...form} />

						<Button size="lg" className="w-full mt-12" type="submit">
							빌드 작성 완료
						</Button>
					</form>
				</Form>
			</Column>

			<Dialog
				open={isSuccessOpen}
				onOpenChange={(open) => {
					setIsSuccessOpen(open);
					if (!open) {
						router.push(SITEMAP.BUILDS);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="hidden">빌드 작성 완료</DialogTitle>
						<DialogDescription asChild>
							<Column className="justify-center items-center gap-4">
								<Image
									src="/white-wolf.png"
									alt="needLogin"
									width={80}
									height={80}
								/>
								<Typography className="text-center" variant="body2">
									성공적으로 빌드를 작성했어요!
									<br />이 빌드가 분명 큰 도움이 될 거예요!
								</Typography>
								<Button
									onClick={() => {
										setIsSuccessOpen(false);
										router.push(SITEMAP.BUILDS);
									}}
								>
									목록으로
								</Button>
							</Column>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</Column>
	);
};
