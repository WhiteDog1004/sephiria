"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { WeaponOptions } from "@/src/entities/weapon/model/types";
import { WeaponContent } from "@/src/features/weapon/ui/WeaponContent";
import { WeaponTierList } from "@/src/features/weapon/ui/WeaponTierTabs";
import { Column, Row, Separator, Tabs, Typography } from "@/src/shared";
import { SectionHeader } from "@/src/shared/components/section-header";
import { parseColoredString } from "../utils/parseColoredString";

export const WeaponList = ({ data }: { data: WeaponOptions[] }) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [selectWeapon, setSelectWeapon] = useState([""]);
	const [selectData, setSelectData] = useState<WeaponOptions>();

	useEffect(() => {
		if (data && selectWeapon) {
			setSelectData(
				data.find(
					(item) => item.value === selectWeapon[selectWeapon.length - 1],
				),
			);
		}
	}, [data, selectWeapon]);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<Column className="w-full items-center gap-8 p-8">
			<SectionHeader
				title={"무기"}
				description={"다양한 무기를 확인해 보세요!"}
			/>
			<Row className="flex-col-reverse lg:flex-row justify-center lg:justify-start items-center lg:items-start gap-8 w-full">
				<Column className="w-full gap-12">
					<Column className="gap-4">
						<Typography>tier 1</Typography>
						<Tabs>
							<Row className="flex-wrap gap-4">
								{data
									.filter((item) => item.tier === 1)
									.map((list) => (
										<WeaponContent
											key={list.uuid}
											handler={() => setSelectWeapon([list.value])}
											list={list}
										/>
									))}
							</Row>
						</Tabs>
					</Column>
					<Row className="flex-wrap gap-4">
						<Column className="gap-12">
							<WeaponTierList
								tier={2}
								parent={selectWeapon[0]}
								data={data}
								onSelect={(value) => setSelectWeapon([selectWeapon[0], value])}
							/>
							<WeaponTierList
								tier={3}
								parent={selectWeapon[1]}
								data={data}
								onSelect={(value) => setSelectWeapon([...selectWeapon, value])}
							/>
						</Column>
					</Row>
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
								src={selectData.image || ""}
								alt={selectData.value}
							/>
						)}
					</Row>
					<Separator />

					{selectData ? (
						<Column className="py-8">
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
						</Column>
					) : (
						<Typography
							variant="body2"
							className="text-center whitespace-pre-line text-gray-400 py-8"
						>
							무기를 선택하면 해당 성능을 확인하실 수 있어요!
						</Typography>
					)}
				</Column>
			</Row>
		</Column>
	);
};
