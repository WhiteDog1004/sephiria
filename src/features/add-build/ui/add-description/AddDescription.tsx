import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
	Column,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Row,
	Typography,
} from "@/src/shared";
import { stripBuildDescriptionHtml } from "@/src/shared/model/buildDescriptionHtml";
import { BUILD_IMAGE_MAX_COUNT } from "@/src/shared/model/buildImage";
import { BuildDescriptionEditor } from "./BuildDescriptionEditor";

type DescriptionFormValues = FieldValues & {
	description: string;
};

export const AddDescription = <TFieldValues extends DescriptionFormValues>({
	form,
	onImageUploaded,
	onUploadingChange,
	postUuid,
	userId,
}: {
	form: UseFormReturn<TFieldValues>;
	onImageUploaded?: (storagePath: string) => void;
	onUploadingChange?: (isUploading: boolean) => void;
	postUuid: string;
	userId: string;
}) => {
	const descriptionPath = "description" as Path<TFieldValues>;

	return (
		<FormField
			control={form.control}
			name={descriptionPath}
			render={({ field }) => (
				<FormItem className="flex flex-col w-full">
					<FormLabel>빌드 설명</FormLabel>
					<FormControl>
						<Column className="items-end gap-2">
							<BuildDescriptionEditor
								value={String(field.value ?? "")}
								onImageUploaded={onImageUploaded}
								onChange={field.onChange}
								onUploadingChange={onUploadingChange}
								postUuid={postUuid}
								userId={userId}
							/>
							{form.getFieldState(descriptionPath, form.formState).error && (
								<FormMessage />
							)}
							<Row className="w-full items-start justify-between gap-2">
								<Typography
									variant="caption"
									className="flex-1 text-muted-foreground"
								>
									이미지는 JPG, PNG, WebP · 원본 2MB 이하 · 최대{" "}
									{BUILD_IMAGE_MAX_COUNT}장까지 첨부 가능
								</Typography>
								<Typography variant="caption" className="shrink-0">
									{stripBuildDescriptionHtml(String(field.value ?? "")).length}
									/2000
								</Typography>
							</Row>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
