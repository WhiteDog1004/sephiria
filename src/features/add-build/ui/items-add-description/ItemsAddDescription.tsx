import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Button,
	FormControl,
	FormField,
	FormItem,
	Input,
	Row,
	Typography,
} from "@/src/shared";

export const ItemsAddDescription = ({
	form,
	index,
}: {
	form: any;
	index: number;
}) => {
	const [isEdit, setIsEdit] = useState(false);

	const fieldValue = form.getValues(`lists.${index}.description`) || "";
	const [tempDescription, setTempDescription] = useState(fieldValue);

	const submitInput = () => {
		form.setValue(`lists.${index}.description`, tempDescription, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setIsEdit(false);
	};

	useEffect(() => {
		setTempDescription(fieldValue);
	}, [fieldValue]);

	return (
		<FormField
			control={form.control}
			name={`lists.${index}.description`}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						{isEdit ? (
							<Row className="items-center gap-2">
								<Input
									value={tempDescription}
									onChange={(e) => setTempDescription(e.target.value)}
									onBlur={field.onBlur}
									ref={field.ref}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											submitInput();
										}
									}}
									placeholder="아티팩트 그룹 설명"
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
										setTempDescription(field.value || "");
										setIsEdit(false);
									}}
								>
									<X />
								</Button>
							</Row>
						) : (
							<Row className="w-full py-2 px-4 bg-secondary/60 rounded-lg">
								<Typography
									variant="body2"
									className={`${clsx(!field.value && "text-gray-500")} w-full cursor-pointer`}
									onClick={() => setIsEdit(true)}
								>
									{field.value ||
										"해당 아티팩트들에 대한 간단한 설명을 입력해 주세요"}
								</Typography>
							</Row>
						)}
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
