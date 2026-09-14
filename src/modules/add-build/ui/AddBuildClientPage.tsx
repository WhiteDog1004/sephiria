"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBuild } from "@/src/entities/add-build";
import type { PostBuildType } from "@/src/entities/add-build/model/createBuild.types";
import type { BuildRow } from "@/src/entities/builds/model/builds.types";
import { useUpdateBuild } from "@/src/entities/modify-build";
import {
	AddPresetCode,
	AddTitle,
	SelectCombo,
	SelectCostume,
	SelectFruitSkewer,
	SelectMiracle,
	SelectTalent,
	SelectWeapon,
} from "@/src/features/add-build";
import { removeBuildImagesFromStorage } from "@/src/features/add-build/lib/buildImageUpload";
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
import { extractBuildImageStoragePaths } from "@/src/shared/model/buildImage";
import { useSession } from "../../header/model/useUserInfo";
import { addFormSchema } from "../model/formSchema";
import { AddItems } from "./AddItems";

export const AddBuildClientPage = ({ modify }: { modify?: BuildRow }) => {
	const router = useRouter();
	const { data: info, isSuccess } = useSession();
	const { mutate, isPending: isCreatePending } = useCreateBuild();
	const { mutate: update, isPending: isUpdatePending } = useUpdateBuild();
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [isImageUploading, setIsImageUploading] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [postUuid, setPostUuid] = useState(modify?.postUuid ?? "");
	const uploadedImagePathsRef = useRef(new Set<string>());
	const isBuildSavedRef = useRef(false);
	const hasRequestedImageCleanupRef = useRef(false);
	const isMutationPending = isCreatePending || isUpdatePending;

	const finishImageUploads = (description: string) => {
		const usedPaths = new Set(extractBuildImageStoragePaths(description));
		const unusedPaths = [...uploadedImagePathsRef.current].filter(
			(path) => !usedPaths.has(path),
		);

		void removeBuildImagesFromStorage(unusedPaths);
		uploadedImagePathsRef.current.clear();
		isBuildSavedRef.current = true;
	};

	const form = useForm({
		resolver: zodResolver(addFormSchema),
		defaultValues: {
			preset_code: "",
			title: "",
			description: "",
			costume: "",
			weapon: "",
			miracle: "",
			combo: [],
			fruit_skewer: [],
			talent: {
				anger: 0,
				rapid: 0,
				survival: 0,
				patience: 0,
				wisdom: 0,
				will: 0,
				base: 0,
			},
			lists: [],
		},
		mode: "onChange",
	});

	const onSubmit = (value: Omit<PostBuildType, "writer" | "postUuid">) => {
		if (isMutationPending || isImageUploading) return;
		if (!postUuid) return;

		if (modify) {
			update(
				{
					preset_code: value.preset_code,
					postUuid,
					title: value.title,
					description: value.description,
					costume: value.costume,
					weapon: value.weapon,
					miracle: value.miracle,
					combo: value.combo,
					fruit_skewer: value.fruit_skewer,
					content: value.lists,
					version: process.env.NEXT_PUBLIC_GAME_VERSION,
					youtube_link: value.youtube_link,
					writer: {
						uuid: info?.user.id || "",
						nickname:
							info?.user.user_metadata.custom_claims.global_name ||
							info?.user.user_metadata.full_name,
						profileImage: info?.user.user_metadata.avatar_url,
					},
					ability: value.talent,
				},
				{
					onSuccess: () => {
						finishImageUploads(value.description);
						form.reset();
						setIsSuccessOpen(true);
					},
				},
			);
		} else {
			mutate(
				{
					preset_code: value.preset_code,
					postUuid,
					title: value.title,
					description: value.description,
					costume: value.costume,
					weapon: value.weapon,
					miracle: value.miracle,
					combo: value.combo,
					fruit_skewer: value.fruit_skewer,
					content: value.lists,
					version: process.env.NEXT_PUBLIC_GAME_VERSION,
					youtube_link: value.youtube_link,
					writer: {
						uuid: info?.user.id || "",
						nickname:
							info?.user.user_metadata.custom_claims.global_name ||
							info?.user.user_metadata.full_name,
						profileImage: info?.user.user_metadata.avatar_url,
					},
					ability: value.talent,
				},
				{
					onSuccess: () => {
						finishImageUploads(value.description);
						form.reset();
						setIsSuccessOpen(true);
					},
				},
			);
		}
	};

	useEffect(() => {
		setPostUuid(modify?.postUuid ?? crypto.randomUUID());
	}, [modify?.postUuid]);

	useEffect(() => {
		const cleanupAbandonedImageUploads = () => {
			if (isBuildSavedRef.current || hasRequestedImageCleanupRef.current)
				return;

			const paths = [...uploadedImagePathsRef.current];
			if (paths.length === 0) return;

			hasRequestedImageCleanupRef.current = true;
			void removeBuildImagesFromStorage(paths);
		};

		window.addEventListener("pagehide", cleanupAbandonedImageUploads);

		return () => {
			window.removeEventListener("pagehide", cleanupAbandonedImageUploads);
			cleanupAbandonedImageUploads();
		};
	}, []);

	useEffect(() => {
		if (modify) {
			form.reset({
				preset_code: modify.preset_code || "",
				title: modify.title,
				description: modify.description,
				costume: modify.costume,
				weapon: modify.weapon,
				miracle: modify.miracle,
				combo: modify.combo || [],
				fruit_skewer: modify.fruit_skewer || [],
				talent: modify.ability,
				lists: modify.content.map((list) => ({
					label: list.label,
					description: list.description,
					items: list.items.map((item) => ({
						id: String(item.id),
						value: item.value,
					})),
				})),
			});
		} else {
			form.reset({
				preset_code: "",
				title: "",
				description: "",
				costume: "",
				weapon: "",
				miracle: "",
				combo: [],
				fruit_skewer: [],
				talent: {
					anger: 0,
					rapid: 0,
					survival: 0,
					patience: 0,
					wisdom: 0,
					will: 0,
					base: 0,
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

						<SelectCombo {...form} />
						<SelectFruitSkewer {...form} />
						<AddItems {...form} />

						<AddDescription
							form={form}
							onImageUploaded={(path) =>
								uploadedImagePathsRef.current.add(path)
							}
							onUploadingChange={setIsImageUploading}
							postUuid={postUuid}
							userId={info?.user.id ?? ""}
						/>
						<AddPresetCode {...form} />

						<Button
							size="lg"
							className="w-full mt-12"
							type="submit"
							disabled={isMutationPending || isImageUploading || !postUuid}
						>
							{isImageUploading ? "이미지 업로드 중..." : "빌드 작성 완료"}
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
