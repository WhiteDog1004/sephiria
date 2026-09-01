"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { WeaponContent } from "@/src/features/weapon/ui/WeaponContent";
import {
	AdSenseHorizontal,
	Button,
	Column,
	Row,
	Separator,
	SITEMAP,
	Typography,
} from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import { parseColoredString } from "../../../shared/utils/parseColoredString";

const getWeaponBuildSearchHref = (weapon: string) => {
	const params = new URLSearchParams({
		page: "1",
		like: "desc",
		latest: "false",
		weapon,
	});

	return `${SITEMAP.BUILDS}?${params.toString()}`;
};

export const WeaponList = ({ data }: { data: WeaponOptions[] }) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const tierOneWeapons = useMemo(
		() => data.filter((item) => item.tier === 1),
		[data],
	);
	const [selectedTierOne, setSelectedTierOne] = useState(
		tierOneWeapons[0]?.value ?? "",
	);
	const [selectedWeapon, setSelectedWeapon] = useState(
		tierOneWeapons[0]?.value ?? "",
	);
	const [selectData, setSelectData] = useState<WeaponOptions>();

	const tierTwoWeapons = useMemo(
		() =>
			data.filter((item) => item.tier === 2 && item.parent === selectedTierOne),
		[data, selectedTierOne],
	);

	const getTierThreeWeapons = (parent: string) =>
		data.filter((item) => item.tier === 3 && item.parent === parent);

	useEffect(() => {
		const nextDefaultWeapon = tierOneWeapons[0]?.value ?? "";

		if (!selectedTierOne && nextDefaultWeapon) {
			setSelectedTierOne(nextDefaultWeapon);
			setSelectedWeapon(nextDefaultWeapon);
		}
	}, [selectedTierOne, tierOneWeapons]);

	useEffect(() => {
		setSelectData(data.find((item) => item.value === selectedWeapon));
	}, [data, selectedWeapon]);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Column className="max-w-7xl w-full items-center gap-8 p-0 md:p-8">
			<SectionHeader
				title={"무기"}
				description={
					"1티어 무기를 선택하면 연결된 진화 무기를 한눈에 볼 수 있어요."
				}
			/>
			<AdSenseHorizontal className="py-0" />
			<Row className="flex-col-reverse items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-start w-full">
				<Column className="w-full min-w-0 gap-4">
					<Typography
						variant="body2"
						className="lg:hidden text-center text-[#969697]"
					>
						무기 목록은 스크롤해서 확인할 수 있어요.
					</Typography>
					<div className="weapon-scroll-area overflow-x-auto rounded-md border-2 border-[#272438] bg-[#141321] p-2">
						<Row className="min-w-max items-center gap-4">
							<div className="grid h-20 w-12 shrink-0 place-items-center text-3xl font-bold text-white">
								I
							</div>
							<Row className="gap-1">
								{tierOneWeapons.map((list) => (
									<WeaponContent
										key={list.uuid}
										handler={() => {
											setSelectedTierOne(list.value);
											setSelectedWeapon(list.value);
										}}
										list={list}
										selected={selectedTierOne === list.value}
									/>
								))}
							</Row>
						</Row>
					</div>
					<div className="weapon-scroll-area overflow-x-auto pb-2">
						<Column className="w-full min-w-max gap-4">
							<div className="w-full rounded-md border-2 border-[#272438] bg-[#141321] p-2">
								<Row className="items-center gap-4">
									<div className="grid h-20 w-12 shrink-0 place-items-center text-3xl font-bold text-white">
										II
									</div>
									<Row className="gap-1">
										{tierTwoWeapons.map((tierTwoWeapon) => (
											<div
												key={tierTwoWeapon.uuid}
												className="grid w-[76px] shrink-0 place-items-center"
											>
												<WeaponContent
													handler={() => setSelectedWeapon(tierTwoWeapon.value)}
													list={tierTwoWeapon}
													selected={selectedWeapon === tierTwoWeapon.value}
												/>
											</div>
										))}
									</Row>
								</Row>
							</div>
							<div className="w-full rounded-md border-2 border-[#272438] bg-[#141321] p-2">
								<Row className="items-start gap-4">
									<div className="grid h-20 w-12 shrink-0 place-items-center text-3xl font-bold text-white">
										III
									</div>
									<Row className="items-start gap-1">
										{tierTwoWeapons.map((tierTwoWeapon) => {
											const tierThreeWeapons = getTierThreeWeapons(
												tierTwoWeapon.value,
											);

											return (
												<Column
													key={tierTwoWeapon.uuid}
													className="w-[76px] shrink-0 items-center gap-1"
												>
													{tierThreeWeapons.map((tierThreeWeapon) => (
														<WeaponContent
															key={tierThreeWeapon.uuid}
															handler={() =>
																setSelectedWeapon(tierThreeWeapon.value)
															}
															list={tierThreeWeapon}
															selected={
																selectedWeapon === tierThreeWeapon.value
															}
														/>
													))}
												</Column>
											);
										})}
									</Row>
								</Row>
							</div>
						</Column>
					</div>
				</Column>
				<Column
					className={`max-w-lg md:min-w-md w-full h-full gap-4 border-2 border-[#9092b3] rounded-lg p-4 ${clsx(theme === "dark" ? "bg-[#32313d]" : "bg-gray-100")}`}
				>
					<Row className="justify-center items-center gap-4 min-h-10">
						<Typography>
							{selectData ? selectData.value_kor : "무기를 선택해주세요"}
						</Typography>
						{selectData && (
							<Image
								className="object-contain w-10 h-10"
								width={40}
								height={40}
								src={getCloudflareUrl(selectData.image || "")}
								alt={selectData.value}
								priority
							/>
						)}
					</Row>
					<Separator />

					{selectData ? (
						<Column className="py-4 gap-6">
							<ul className="inline-flex flex-col gap-4 pl-4">
								{selectData.effects.reward[0] !== "" ? (
									selectData.effects.reward.map((reward) => (
										<li key={reward} className="marker:content-['-']">
											<Typography
												variant="body2"
												className="text-start whitespace-pre-line ml-2"
											>
												{parseColoredString(reward)}
											</Typography>
										</li>
									))
								) : (
									<Typography
										variant="body2"
										className="text-center whitespace-pre-line text-gray-400"
									>
										1티어 무기는 추가 능력이 없습니다
									</Typography>
								)}
							</ul>
							{[1, 3].includes(selectData.tier) && (
								<Button asChild className="self-center">
									<Link href={getWeaponBuildSearchHref(selectData.value)}>
										<Search />
										<Typography variant="caption">
											{selectData.value_kor} 빌드 보러가기
										</Typography>
									</Link>
								</Button>
							)}
						</Column>
					) : (
						<Typography
							variant="body2"
							className="text-center whitespace-pre-line text-gray-400 py-8"
						>
							무기를 선택하면 해당 능력을 확인할 수 있어요
						</Typography>
					)}
				</Column>
			</Row>
		</Column>
	);
};
