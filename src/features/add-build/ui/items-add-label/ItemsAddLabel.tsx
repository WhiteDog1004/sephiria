import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Column,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input,
	Row,
	Typography,
} from "@/src/shared";

export const ItemsAddLabel = ({
	form,
	index,
}: {
	form: any;
	index: number;
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isEdit, setIsEdit] = useState(false);

	const fieldValue = form.getValues(`lists.${index}.label`) || "";
	const [tempLabel, setTempLabel] = useState(fieldValue);

	const submitInput = () => {
		form.setValue(`lists.${index}.label`, tempLabel, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setIsEdit(false);
	};

	useEffect(() => {
		setTempLabel(fieldValue);
	}, [fieldValue]);

	useEffect(() => {
		if (isEdit && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEdit]);

	return (
		<FormField
			control={form.control}
			name={`lists.${index}.label`}
			render={({ field }) => (
				<FormItem className="flex">
					<FormControl>
						<Column className="w-full gap-2">
							{isEdit ? (
								<Row className="items-center gap-2">
									<Input
										value={tempLabel}
										onChange={(e) => setTempLabel(e.target.value)}
										onBlur={field.onBlur}
										ref={(el) => {
											field.ref(el);
											inputRef.current = el;
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												submitInput();
											}
										}}
										placeholder="아티팩트 그룹 제목"
									/>
									<Button
										type="button"
										size="icon"
										variant="default"
										className="bg-green-400"
										onClick={submitInput}
									>
										<Check />
									</Button>
									<Button
										type="button"
										size="icon"
										variant="default"
										className="bg-red-400"
										onClick={() => {
											setTempLabel(field.value || "");
											setIsEdit(false);
										}}
									>
										<X />
									</Button>
								</Row>
							) : (
								<Row className="w-full py-2 bg-secondary/20 rounded-lg">
									<Typography
										variant="body2"
										className={`${clsx(!field.value && "text-gray-500")} w-full cursor-pointer truncate`}
										onClick={() => setIsEdit(true)}
									>
										{field.value ||
											"해당 아티팩트들에 대한 제목을 입력해 주세요"}
									</Typography>
								</Row>
							)}
							<Box className="p-0 justify-start">
								<FormMessage />
							</Box>
						</Column>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
