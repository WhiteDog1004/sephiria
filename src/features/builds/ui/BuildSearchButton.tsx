import { RotateCw, Search } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { useGetMiracles, useGetWeapons } from "@/src/entities/builds";
import type { WeaponRow } from "@/src/entities/weapon/model/types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
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
	Popover,
	PopoverContent,
	PopoverTrigger,
	Row,
	Select,
	SelectContent,
	SelectItem,
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
import { getCloudflareUrl } from "@/src/shared/utils/image";
import { useBuildSearchStore } from "../model/buildSearchStore";

const getTier2Weapons = (weapons: WeaponRow[], tier1Value: string) =>
	weapons.filter((weapon) => weapon.tier === 2 && weapon.parent === tier1Value);

const getTier3Weapons = (weapons: WeaponRow[], tier2Values: Set<string>) =>
	weapons.filter(
		(weapon) => weapon.tier === 3 && tier2Values.has(weapon.parent ?? ""),
	);

const WeaponOptionButton = ({
	weapon,
	isSelected,
	onSelect,
	variant = "grid",
}: {
	weapon: WeaponRow;
	isSelected: boolean;
	onSelect: (value: string) => void;
	variant?: "grid" | "row";
}) => (
	<button
		type="button"
		onClick={() => onSelect(weapon.value)}
		className={`border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
			isSelected ? "border-primary bg-primary/10" : "border-border"
		} ${
			variant === "grid"
				? "flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md p-2"
				: "flex min-h-12 w-full items-center gap-2 rounded-md px-3 py-2 text-left"
		}`}
	>
		<ImageWithFallback
			className={`object-contain p-0 ${
				variant === "grid"
					? "min-h-9 max-h-9 min-w-9 max-w-9"
					: "min-h-7 max-h-7 min-w-7 max-w-7"
			}`}
			width={36}
			height={36}
			src={getCloudflareUrl(`/weapons/${weapon.value}.png`)}
			alt={weapon.value}
		/>
		<Typography
			variant="caption"
			className={variant === "grid" ? "text-center leading-tight" : "truncate"}
		>
			{weapon.value_kor}
		</Typography>
	</button>
);

type BuildSearchFormValues = {
	title: string;
	costume: string;
	weapon: string;
	miracle: string;
	combo: string;
};

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
	const [isTitle, setIsTitle] = useState(false);
	const [hideFloatingButton, setHideFloatingButton] = useState(false);
	const [weaponPopoverOpen, setWeaponPopoverOpen] = useState(false);

	const form = useForm<BuildSearchFormValues>({
		defaultValues: {
			title: "",
			costume: "",
			weapon: "",
			miracle: "",
			combo: "",
		},
	});

	const onSubmit = (value: BuildSearchFormValues) => {
		setSearchList({ ...value, isWriter: !isTitle });
		setOpen(false);
		setPage(1);
	};

	const onReset = () => {
		form.reset();
		setWeaponPopoverOpen(false);
		setSearchList({});
		setOpen(false);
		setPage(1);
	};

	const selectedWeaponValue = form.watch("weapon");

	const selectedWeapon = useMemo(
		() => weapons?.find((weapon) => weapon.value === selectedWeaponValue),
		[weapons, selectedWeaponValue],
	);

	const tier1Weapons = useMemo(
		() => weapons?.filter((weapon) => weapon.tier === 1) ?? [],
		[weapons],
	);

	const tier3WeaponGroups = useMemo(() => {
		if (!weapons) return [];

		return tier1Weapons
			.map((tier1) => {
				const childTier2Weapons = getTier2Weapons(weapons, tier1.value);
				const tier2Values = new Set(
					childTier2Weapons.map((weapon) => weapon.value),
				);

				return {
					tier1,
					weapons: getTier3Weapons(weapons, tier2Values),
				};
			})
			.filter((group) => group.weapons.length > 0);
	}, [tier1Weapons, weapons]);

	useEffect(() => {
		const updateButtonVisibility = () => {
			const isMobile = window.innerWidth <= 768;
			if (!isMobile) {
				setHideFloatingButton(false);
				return;
			}

			const scrollTop = window.scrollY;
			const viewportHeight = window.innerHeight;
			const pageHeight = document.documentElement.scrollHeight;
			const isBottom = scrollTop + viewportHeight >= pageHeight - 8;

			setHideFloatingButton(isBottom);
		};

		updateButtonVisibility();
		window.addEventListener("scroll", updateButtonVisibility, {
			passive: true,
		});
		window.addEventListener("resize", updateButtonVisibility);

		return () => {
			window.removeEventListener("scroll", updateButtonVisibility);
			window.removeEventListener("resize", updateButtonVisibility);
		};
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="secondary"
					size="lg"
					className={`fixed right-4 bottom-4 rounded-full border transition-opacity ${
						hideFloatingButton ? "opacity-0 pointer-events-none" : "opacity-100"
					}`}
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
										<FormLabel>{isTitle ? "제목" : "작성자"}</FormLabel>
										<Row className="gap-2">
											<Select
												onValueChange={(value) =>
													value === "title"
														? setIsTitle(true)
														: setIsTitle(false)
												}
											>
												<SelectTrigger className="min-w-28 w-28">
													<SelectValue
														placeholder={isTitle ? "제목" : "작성자"}
													/>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="writer">작성자</SelectItem>
													<SelectItem value="title">제목</SelectItem>
												</SelectContent>
											</Select>
											<FormControl>
												<Input
													className="text-xs"
													placeholder={`${isTitle ? "제목" : "작성자"} 검색`}
													{...field}
												/>
											</FormControl>
										</Row>
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
															src={getCloudflareUrl(`/costume/${costume}.png`)}
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
										<Popover
											open={weaponPopoverOpen}
											onOpenChange={setWeaponPopoverOpen}
										>
											<PopoverTrigger asChild>
												<Button
													type="button"
													variant="outline"
													className="w-full justify-start"
												>
													{selectedWeapon ? (
														<>
															<ImageWithFallback
																className="min-h-5 max-h-5 min-w-5 max-w-5 object-contain p-0"
																width={20}
																height={20}
																src={getCloudflareUrl(
																	`/weapons/${selectedWeapon.value}.png`,
																)}
																alt={selectedWeapon.value}
															/>
															<Typography
																variant="caption"
																className="truncate"
															>
																{selectedWeapon.value_kor}
															</Typography>
														</>
													) : (
														<Typography
															variant="caption"
															className="opacity-60"
														>
															무기 선택
														</Typography>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent
												align="start"
												collisionPadding={16}
												portalled={false}
												sideOffset={8}
												className="z-[60] max-h-[var(--radix-popover-content-available-height)] w-[min(calc(100vw-2rem),360px)] overflow-y-auto p-3"
											>
												<Column className="w-full gap-3">
													<div className="grid w-full grid-cols-3 gap-2">
														{tier1Weapons.map((weapon) => (
															<WeaponOptionButton
																key={weapon.value}
																weapon={weapon}
																isSelected={
																	selectedWeaponValue === weapon.value
																}
																onSelect={(value) => {
																	field.onChange(value);
																	setWeaponPopoverOpen(false);
																}}
															/>
														))}
													</div>

													<Accordion
														type="multiple"
														className="w-full space-y-2"
													>
														<AccordionItem
															value="tier3-weapons"
															className="rounded-md border px-2 last:border-b"
														>
															<AccordionTrigger
																type="button"
																className="py-2 hover:no-underline"
															>
																<Typography variant="caption">
																	3티어 무기
																</Typography>
															</AccordionTrigger>
															<AccordionContent className="pb-3 pt-2">
																<Accordion
																	type="multiple"
																	className="w-full space-y-2"
																>
																	{tier3WeaponGroups.map(
																		({ tier1, weapons }) => (
																			<AccordionItem
																				key={tier1.value}
																				value={`tier3-${tier1.value}`}
																				className="rounded-md border px-2 last:border-b"
																			>
																				<AccordionTrigger
																					type="button"
																					className="py-2 hover:no-underline"
																				>
																					<Row className="min-w-0 gap-2">
																						<ImageWithFallback
																							className="min-h-6 max-h-6 min-w-6 max-w-6 object-contain p-0"
																							width={24}
																							height={24}
																							src={getCloudflareUrl(
																								`/weapons/${tier1.value}.png`,
																							)}
																							alt={tier1.value}
																						/>
																						<Typography
																							variant="caption"
																							className="truncate"
																						>
																							{tier1.value_kor}
																						</Typography>
																					</Row>
																				</AccordionTrigger>
																				<AccordionContent className="grid gap-1 pb-2 pt-1">
																					{weapons.map((weapon) => (
																						<WeaponOptionButton
																							key={weapon.value}
																							weapon={weapon}
																							isSelected={
																								selectedWeaponValue ===
																								weapon.value
																							}
																							onSelect={(value) => {
																								field.onChange(value);
																								setWeaponPopoverOpen(false);
																							}}
																							variant="row"
																						/>
																					))}
																				</AccordionContent>
																			</AccordionItem>
																		),
																	)}
																</Accordion>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</Column>
											</PopoverContent>
										</Popover>
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
															src={getCloudflareUrl(miracle.image || "")}
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
								name="combo"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>핵심 콤보</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="핵심 콤보 선택" />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(EFFECT_LABELS).map(([value, label]) => (
													<SelectItem key={value} value={value}>
														<ImageWithFallback
															className="min-w-4 max-w-4 p-0"
															width={24}
															height={24}
															src={`/combo/${value}.png`}
															alt={value}
															unoptimized
														/>
														{label}
													</SelectItem>
												))}
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
