import {
	Box,
	Column,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Row,
	Textarea,
	Typography,
} from "@/src/shared";

export const AddTitle = (form: any) => {
	return (
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>빌드 제목</FormLabel>
					<FormControl>
						<Column className="items-end gap-2">
							<Textarea
								className="text-xs resize-none max-h-16"
								placeholder="80자내로 입력해 주세요"
								{...field}
							/>
							<Row className="items-center justify-between w-full">
								{form.formState.errors.title ? (
									<FormMessage />
								) : (
									<Box className="p-0" />
								)}
								<Typography variant="caption">
									{field.value.length}/80
								</Typography>
							</Row>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
