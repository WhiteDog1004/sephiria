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
							<Textarea
								className="text-xs resize-none w-full max-h-40"
								placeholder="500자내로 입력해 주세요."
								{...field}
							/>
							<Row className="items-center justify-between w-full">
								{form.formState.errors.description ? (
									<FormMessage />
								) : (
									<Box className="p-0" />
								)}
								<Typography variant="caption">
									{field.value.length}/500
								</Typography>
							</Row>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
