import {
	Box,
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
import { BuildDescriptionEditor } from "./BuildDescriptionEditor";

export const AddDescription = (form: any) => {
	return (
		<FormField
			control={form.control}
			name="description"
			render={({ field }) => (
				<FormItem className="flex flex-col w-full">
					<FormLabel>빌드 설명</FormLabel>
					<FormControl>
						<Column className="items-end gap-2">
							<BuildDescriptionEditor
								value={field.value}
								onChange={field.onChange}
							/>
							<Row className="items-center justify-between w-full">
								{form.formState.errors.description ? (
									<FormMessage />
								) : (
									<Box className="p-0" />
								)}
								<Typography variant="caption">
									{stripBuildDescriptionHtml(field.value).length}/2000
								</Typography>
							</Row>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
