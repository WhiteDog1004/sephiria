import clsx from "clsx";
import debounce from "lodash.debounce";
import { CopyPlus, RotateCw, Search, X } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import {
	useGetArtifacts,
	useGetMiracles,
	useGetWeapons,
} from "@/src/entities/builds";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import type { WeaponRow } from "@/src/entities/weapon/model/types";
import { EFFECT_LABELS } from "@/src/features/simulator/config/constants";
import {
	getRarityValue,
	type Rarity,
} from "@/src/features/simulator/lib/getRarityOrder";
import { ArtifactTooltip } from "@/src/features/simulator/ui/ArtifactTooltip";
import { useSession } from "@/src/modules/header/model/useUserInfo";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	Checkbox,
	COSTUMES,
	Column,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	ImageWithFallback,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	RequireLoginDialog,
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
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/src/shared";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import { getTierBorderColor } from "../../add-build/config/getTierBorderColor";
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
	artifacts: string[];
	isLatestVersion: boolean;
	likedOnly: boolean;
	presetCodeOnly: boolean;
};

const MAX_ARTIFACT_SEARCH_COUNT = 5;

const ArtifactSearchPicker = ({
	artifacts,
	value,
	onChange,
}: {
	artifacts: ArtifactInstance["item"][];
	value: string[];
	onChange: (value: string[]) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentValue, setCurrentValue] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [selectedSets, setSelectedSets] = useState("all");
	const [selectIndex, setSelectIndex] = useState(0);

	const effectData = useMemo(
		() => [
			{ value: "all", label: "콤보 전체" },
			...Object.entries(EFFECT_LABELS).map(([value, label]) => ({
				value,
				label,
			})),
		],
		[],
	);

	const handleSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearchInput(value);
			}, 200),
		[],
	);

	const filteredItems = useMemo(
		() =>
			[...artifacts]
				.sort(
					(a, b) =>
						getRarityValue(a.tier as Rarity) - getRarityValue(b.tier as Rarity),
				)
				.filter((item) => {
					const matchesSearch = item.label_kor
						.toLowerCase()
						.includes(searchInput.toLowerCase());
					const matchesSets =
						selectedSets === "all" || item.effect.sets?.includes(selectedSets);
					return matchesSearch && matchesSets;
				}),
		[artifacts, searchInput, selectedSets],
	);

	const handleSelectArtifact = (itemValue: string) => {
		const nextValue = [...value];
		const currentIndex = nextValue.indexOf(itemValue);

		if (currentIndex !== -1 && currentIndex !== selectIndex) {
			nextValue.splice(currentIndex, 1);
		}

		if (nextValue[selectIndex]) {
			nextValue[selectIndex] = itemValue;
		} else if (nextValue.length < MAX_ARTIFACT_SEARCH_COUNT) {
			nextValue.push(itemValue);
		}

		onChange(nextValue);
		setIsOpen(false);
	};

	const removeArtifact = (index: number) => {
		onChange(value.filter((_, itemIndex) => itemIndex !== index));
	};

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<Column className="w-full gap-2">
				<Row className="grid w-full grid-cols-[repeat(auto-fill,minmax(52px,52px))] items-center gap-1.5">
					{value.map((artifactValue, index) => {
						const artifact = artifacts.find(
							(item) => item.value === artifactValue,
						);

						return (
							<Row key={artifactValue} className="group relative">
								<Button
									onClick={() => {
										setIsOpen(true);
										setSelectIndex(index);
									}}
									type="button"
									className="h-[52px] w-[52px] p-1"
								>
									<ImageWithFallback
										className="max-h-11 min-w-11 max-w-11 p-0"
										width={44}
										height={44}
										src={getCloudflareUrl(artifact?.image || "/")}
										alt={artifactValue}
									/>
								</Button>
								<Button
									type="button"
									className="absolute top-1 right-1 hidden h-max !p-0 opacity-60 group-hover:flex"
									variant="ghost"
									onClick={() => removeArtifact(index)}
								>
									<X className="text-red-500" />
								</Button>
							</Row>
						);
					})}
					{value.length < MAX_ARTIFACT_SEARCH_COUNT && (
						<Button
							onClick={() => {
								setIsOpen(true);
								setSelectIndex(value.length);
							}}
							type="button"
							className="h-[52px] w-[52px] opacity-40 hover:opacity-100"
						>
							<CopyPlus className="text-gray-500" />
						</Button>
					)}
				</Row>
				<DrawerContent className="w-full">
					<DrawerHeader>
						<DrawerTitle>
							<Typography variant="body2">아티팩트를 선택해 주세요</Typography>
						</DrawerTitle>
					</DrawerHeader>

					<Column className="mx-auto w-full max-w-3xl gap-2 px-4 py-4 md:px-0">
						<Row className="w-full gap-2">
							<Input
								placeholder="아티팩트 검색"
								value={currentValue}
								onChange={(event) => {
									setCurrentValue(event.target.value);
									handleSearch(event.target.value);
								}}
							/>
							<Select value={selectedSets} onValueChange={setSelectedSets}>
								<SelectTrigger className="w-28 min-w-28">
									<SelectValue placeholder="콤보 선택" />
								</SelectTrigger>
								<SelectContent>
									{effectData.map((sets) => (
										<SelectItem key={sets.value} value={sets.value}>
											{sets.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Row>

						<Row className="grid max-h-[260px] grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2 overflow-y-auto sm:max-h-[400px]">
							{filteredItems.map((item) => (
								<Tooltip delayDuration={400} key={item.value}>
									<TooltipTrigger asChild>
										<Button
											type="button"
											className={`h-max p-0 ${clsx(getTierBorderColor(item.tier))}`}
											onClick={() => handleSelectArtifact(item.value)}
										>
											<ImageWithFallback
												className="max-h-12 min-w-12 max-w-12 p-0"
												width={48}
												height={48}
												src={getCloudflareUrl(item.image)}
												alt={item.value}
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent sideOffset={16}>
										<ArtifactTooltip data={item as ArtifactInstance["item"]} />
									</TooltipContent>
								</Tooltip>
							))}
						</Row>
					</Column>
				</DrawerContent>
			</Column>
		</Drawer>
	);
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
	const {
		isLatestVersion,
		setIsLatestVersion,
		likedOnly,
		setLikedOnly,
		presetCodeOnly,
		setPresetCodeOnly,
		setSearchList,
	} = useBuildSearchStore();
	const { data: info } = useSession();
	const { data: weapons } = useGetWeapons();
	const { data: miracles } = useGetMiracles();
	const { data: artifacts } = useGetArtifacts();
	const [isTitle, setIsTitle] = useState(false);
	const [hideFloatingButton, setHideFloatingButton] = useState(false);
	const [weaponPopoverOpen, setWeaponPopoverOpen] = useState(false);
	const [openLoginDialog, setOpenLoginDialog] = useState(false);

	const form = useForm<BuildSearchFormValues>({
		defaultValues: {
			title: "",
			costume: "",
			weapon: "",
			miracle: "",
			combo: "",
			artifacts: [],
			isLatestVersion,
			likedOnly,
			presetCodeOnly,
		},
	});

	const onSubmit = (value: BuildSearchFormValues) => {
		const { isLatestVersion, likedOnly, presetCodeOnly, ...searchValue } =
			value;

		setSearchList({ ...searchValue, isWriter: !isTitle });
		setIsLatestVersion(isLatestVersion);
		setLikedOnly(likedOnly);
		setPresetCodeOnly(presetCodeOnly);
		setOpen(false);
		setPage(1);
	};

	const onReset = () => {
		form.reset();
		setWeaponPopoverOpen(false);
		setSearchList({});
		setIsLatestVersion(false);
		setLikedOnly(false);
		setPresetCodeOnly(false);
		setOpen(false);
		setPage(1);
	};

	const handleLikedOnlyChange = (checked: boolean) => {
		if (checked && !info) {
			setOpenLoginDialog(true);
			return;
		}

		form.setValue("likedOnly", checked, {
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	const selectedWeaponValue = form.watch("weapon");
	const selectedArtifacts = form.watch("artifacts");
	const selectedIsLatestVersion = form.watch("isLatestVersion");
	const selectedLikedOnly = form.watch("likedOnly");
	const selectedPresetCodeOnly = form.watch("presetCodeOnly");

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

	useEffect(() => {
		if (!open) return;

		form.setValue("isLatestVersion", isLatestVersion, { shouldDirty: false });
		form.setValue("likedOnly", likedOnly, { shouldDirty: false });
		form.setValue("presetCodeOnly", presetCodeOnly, { shouldDirty: false });
	}, [form, isLatestVersion, likedOnly, open, presetCodeOnly]);

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
			<RequireLoginDialog
				open={openLoginDialog}
				onOpenChange={setOpenLoginDialog}
				actionText="좋아요한 빌드를 보시려면"
			/>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>빌드 검색하기</SheetTitle>
					<SheetDescription className="text-xs">
						검색을 통해 원하는 빌드를 찾아보세요!
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form
						className="flex min-h-0 flex-1 flex-col overflow-hidden md:gap-4 md:overflow-y-auto md:px-4 md:pb-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<Column className="min-h-0 w-full flex-1 gap-4 overflow-y-auto px-4 pb-3 items-end md:flex-none md:overflow-visible md:px-0 md:pb-0">
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

							<Row className="w-full flex-wrap gap-2">
								<Label className="h-8 w-max rounded-md border px-2 text-xs hover:bg-accent/50 flex items-center gap-1.5">
									<Checkbox
										checked={selectedIsLatestVersion}
										onCheckedChange={(checked: boolean) => {
											form.setValue("isLatestVersion", checked, {
												shouldDirty: true,
												shouldTouch: true,
											});
										}}
										className="size-4 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
									/>
									최신버전만
								</Label>
								<Label className="h-8 w-max rounded-md border px-2 text-xs hover:bg-accent/50 flex items-center gap-1.5">
									<Checkbox
										checked={selectedPresetCodeOnly}
										onCheckedChange={(checked: boolean) => {
											form.setValue("presetCodeOnly", checked, {
												shouldDirty: true,
												shouldTouch: true,
											});
										}}
										className="size-4 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
									/>
									프리셋코드
								</Label>
							</Row>

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
							<FormField
								control={form.control}
								name="artifacts"
								render={() => (
									<FormItem className="w-full">
										<FormLabel>아티팩트</FormLabel>
										<FormControl>
											<ArtifactSearchPicker
												artifacts={artifacts ?? []}
												value={selectedArtifacts ?? []}
												onChange={(value) =>
													form.setValue("artifacts", value, {
														shouldDirty: true,
														shouldTouch: true,
													})
												}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</Column>

						<Row className="sticky bottom-0 shrink-0 gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur md:static md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
							<Button type="reset" onClick={onReset} size="lg">
								<RotateCw />
								<Typography variant="caption">초기화</Typography>
							</Button>
							<Button
								className="min-w-0 flex-1"
								disabled={!form.formState.isDirty}
								type="submit"
								size="lg"
							>
								빌드 검색하기
							</Button>
						</Row>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};
