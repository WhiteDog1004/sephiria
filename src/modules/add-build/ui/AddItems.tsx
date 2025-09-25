import { CopyPlus, X } from "lucide-react";
import { useEffect } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { useGetArtifacts } from "@/src/entities/builds";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import {
	ItemsAddDescription,
	ItemsAddItems,
	ItemsAddLabel,
} from "@/src/features/add-build";
import { Button, Column, Separator, Typography } from "@/src/shared";

export const AddItems = (form: UseFormReturn<any>) => {
	const { data: artifacts } = useGetArtifacts();
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "lists",
	});

	useEffect(() => {
		if (fields.length !== 0) return;
		append({
			items: [],
			label: "",
			description: "",
			id: "",
		});
	}, [append, fields]);

	return (
		<Column className="w-full items-center gap-2">
			<Typography variant="body2">아티팩트</Typography>
			<Column className="gap-4 p-4 w-full border rounded-lg items-center">
				{fields.map((group: any, index) => (
					<Column
						key={group.id}
						className="w-full gap-2 p-4 border items-end rounded-lg bg-secondary/10 dark:bg-secondary/40"
					>
						<Column className="w-full gap-2">
							<ItemsAddLabel form={form} index={index} />
							<Separator />
							<ItemsAddItems
								artifacts={artifacts as ArtifactInstance["item"][]}
								form={form}
								index={index}
							/>
							<Separator />
							<ItemsAddDescription form={form} index={index} />
						</Column>

						<Button
							type="button"
							size="icon"
							className="opacity-30 hover:opacity-100"
							onClick={() => remove(index)}
						>
							<X className="text-red-500" />
						</Button>
					</Column>
				))}
				{fields.length < 5 && (
					<Button
						type="button"
						onClick={() => {
							append({
								items: [],
								label: "",
								description: "",
								id: "",
							});
						}}
						asChild
					>
						<Column className="gap-4 w-max h-max py-4 px-8">
							<CopyPlus className="text-gray-500" />
							<Typography variant="body2" className="text-gray-500">
								그룹 추가하기
							</Typography>
						</Column>
					</Button>
				)}
			</Column>
		</Column>
	);
};
