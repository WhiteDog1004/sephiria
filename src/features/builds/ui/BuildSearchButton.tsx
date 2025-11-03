import { RotateCw, Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useGetMiracles, useGetWeapons } from "@/src/entities/builds";
import {
	Button,
	COSTUMES,
	Column,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	ImageWithFallback,
	Input,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Typography,
} from "@/src/shared";
import { useBuildSearchStore } from "../model/buildSearchStore";

export const BuildSearchButton = ({
	setPage,
	open,
	setOpen,
}: {
	setPage: Dispatch<SetStateAction<number>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const { setSearchList } = useBuildSearchStore();
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();

	const form = useForm({
		defaultValues: {
			title: "",
			costume: "",
			weapon: "",
			miracle: "",
			like: "",
		},
	});

	const onSubmit = (value: any) => {
		setSearchList(value);
		setOpen(false);
		setPage(1);
	};

	const onReset = () => {
		form.reset();
		setSearchList({});
		setOpen(false);
		setPage(1);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="secondary"
					size="lg"
					className={`fixed right-4 bottom-4 rounded-full border`}
				>
					<Search />
					<Typography variant="caption">검색</Typography>
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>빌드 검색하기</SheetTitle>
					<SheetDescription className="text-xs">
						검색을 통해 원하는 빌드를 찾아보세요!
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form
						className="flex flex-col gap-4 px-4 pb-4 h-full overflow-y-auto justify-between"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<Column className="w-full gap-4 items-end">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>제목</FormLabel>
										<FormControl>
											<Input
												className="text-xs"
												placeholder="제목 검색"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="costume"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>코스튬</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="코스튬 선택" />
											</SelectTrigger>
											<SelectContent>
												{Object.keys(COSTUMES).map((costume) => (
													<SelectItem key={costume} value={costume}>
														<ImageWithFallback
															className="min-w-4 max-w-4 p-0"
															width={24}
															height={24}
															src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${costume}.png`}
															alt={costume}
														/>
														{COSTUMES[costume].name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="weapon"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>무기</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="무기 선택" />
											</SelectTrigger>
											<SelectContent>
												{weapons
													?.filter((weapon) => weapon.tier === 1)
													.map((tier1) => (
														<SelectGroup key={tier1.value}>
															<SelectLabel className="flex items-center gap-1">
																<ImageWithFallback
																	className="min-w-4 max-w-4 p-0"
																	width={24}
																	height={24}
																	src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${tier1.value}.png`}
																	alt={tier1.value}
																/>
																{tier1.value_kor}
															</SelectLabel>

															{weapons
																?.filter(
																	(tier3) =>
																		tier3.tier === 3 &&
																		weapons.find(
																			(tier2) =>
																				tier2.tier === 2 &&
																				tier2.value === tier3.parent &&
																				tier2.parent === tier1.value,
																		),
																)
																.map((tier3) => (
																	<SelectItem
																		key={tier3.value}
																		value={tier3.value}
																	>
																		<ImageWithFallback
																			className="min-w-4 max-w-4 p-0"
																			width={24}
																			height={24}
																			src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${tier3.value}.png`}
																			alt={tier3.value}
																		/>
																		{tier3.value_kor}
																	</SelectItem>
																))}
														</SelectGroup>
													))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="miracle"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>기적</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="기적 선택" />
											</SelectTrigger>
											<SelectContent>
												{miracles?.map((miracle) => (
													<SelectItem key={miracle.value} value={miracle.value}>
														<ImageWithFallback
															className="min-w-4 max-w-4 p-0"
															width={24}
															height={24}
															src={miracle.image}
															alt={miracle.value}
														/>
														{miracle.value_kor}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="like"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>보기 순서</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="보기 순서" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={"desc"}>좋아요 높은 순</SelectItem>
												<SelectItem value={"asc"}>최신 순</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<Button type="reset" onClick={onReset}>
								<RotateCw />
								<Typography variant="caption">초기화</Typography>
							</Button>
						</Column>

						<Button disabled={!form.formState.isDirty} type="submit" size="lg">
							검색하기
						</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};
