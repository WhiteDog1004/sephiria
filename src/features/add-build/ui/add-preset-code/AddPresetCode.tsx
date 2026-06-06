import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/src/shared";

type PresetCodeFormValues = FieldValues & {
	preset_code: string;
};

export const AddPresetCode = <TFieldValues extends PresetCodeFormValues>({
	control,
}: {
	control: Control<TFieldValues>;
}) => {
	return (
		<FormField
			control={control}
			name={"preset_code" as Path<TFieldValues>}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>프리셋 코드</FormLabel>
					<FormControl>
						<Input
							placeholder="프리셋 코드를 이곳에 붙여 넣어주세요."
							autoComplete="off"
							spellCheck={false}
							{...field}
						/>
					</FormControl>
					<FormDescription>
						프리셋을 공유하고 싶다면 게임에서 프리셋 코드를 복사 후 이곳에
						넣어주세요.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
