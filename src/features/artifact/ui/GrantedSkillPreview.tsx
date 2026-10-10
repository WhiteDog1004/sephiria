"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { getCloudflareUrl } from "@/src/shared/utils/image";

type SkillStat = {
	label: string;
	value: string | number;
	accent?: string;
	accentClassName?: string;
	icon?: string;
};

type SkillStage = {
	description: string;
	iconValue: number;
	mpCost: number;
	stats?: SkillStat[];
	statLabel?: string;
	statValue?: string | number;
	statAccent?: string;
	statAccentClassName?: string;
	secondaryStat?: {
		label: string;
		value: string | number;
		icon?: string;
	};
};

type GrantedSkill = {
	name: string;
	stages: SkillStage[];
};

const getStageStats = (stage: SkillStage): SkillStat[] => {
	if (stage.stats) return stage.stats;

	return [
		...(stage.statLabel && stage.statValue !== undefined
			? [
					{
						label: stage.statLabel,
						value: stage.statValue,
						accent: stage.statAccent,
						accentClassName: stage.statAccentClassName,
					},
				]
			: []),
		...(stage.secondaryStat ? [stage.secondaryStat] : []),
	];
};

const GRANTED_SKILLS: Partial<Record<string, GrantedSkill>> = {
	lightning_bolt: {
		name: "라이트닝 볼트",
		stages: [
			{
				description: "인접한 적을 추가로 공격하는 투사체 발사",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 20,
				statAccent: "번개속성 피해 40%",
			},
			{
				description: "인접한 적을 추가로 공격하는 투사체 발사",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 22,
				statAccent: "번개속성 피해 60%",
			},
		],
	},
	shield: {
		name: "보호막",
		stages: [
			{
				description: "보호막을 12 획득하는 버프 부여",
				iconValue: 20,
				mpCost: 20,
				statLabel: "지속시간",
				statValue: 6,
			},
			{
				description: "보호막을 12 획득하는 버프 부여",
				iconValue: 20,
				mpCost: 12,
				statLabel: "지속시간",
				statValue: 6,
			},
		],
	},
	ice_bolt: {
		name: "아이스 볼트",
		stages: [
			{
				description: "주변의 수분을 결정화한 투사체를 2회 발사",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 14,
				statAccent: "얼음속성 피해 20%",
			},
			{
				description: "주변의 수분을 결정화한 투사체를 2회 발사",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 16,
				statAccent: "얼음속성 피해 30%",
			},
		],
	},
	smoke_screen: {
		name: "연막",
		stages: [
			{
				description:
					"주위에 적의 공격을 3회 회피하는 연막을 소환합니다.\n3회 회피 시 연막은 사라집니다.",
				iconValue: 30,
				mpCost: 24,
				statLabel: "지속시간",
				statValue: 10,
			},
		],
	},
	blessing: {
		name: "축복",
		stages: [
			{
				description: "모든 피해량을 5% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 16,
				statLabel: "지속시간",
				statValue: 12,
			},
			{
				description: "모든 피해량을 5% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 13,
				statLabel: "지속시간",
				statValue: 12,
			},
			{
				description: "모든 피해량을 5% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 10,
				statLabel: "지속시간",
				statValue: 12,
			},
		],
	},
	fire_bolt: {
		name: "파이어 볼트",
		stages: [
			{
				description: "작은 화염 투사체를 생성하며 던짐",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "화염속성 피해 50%",
				statAccentClassName: "text-orange-400",
			},
			{
				description: "작은 화염 투사체를 생성하며 던짐",
				iconValue: 1,
				mpCost: 2,
				statLabel: "피해량",
				statValue: 28,
				statAccent: "화염속성 피해 80%",
				statAccentClassName: "text-orange-400",
			},
		],
	},
	great_blessing: {
		name: "대축복",
		stages: [
			{
				description: "모든 피해량을 12% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 19,
				statLabel: "지속시간",
				statValue: 12,
			},
			{
				description: "모든 피해량을 12% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 15,
				statLabel: "지속시간",
				statValue: 12,
			},
			{
				description: "모든 피해량을 12% 증가시키는 버프를 획득",
				iconValue: 20,
				mpCost: 12,
				statLabel: "지속시간",
				statValue: 12,
			},
		],
	},
	sharp_eye: {
		name: "샤프 아이",
		stages: [
			{
				description: "치명타 확률이 12% 증가하는 버프를 획득",
				iconValue: 30,
				mpCost: 24,
				statLabel: "지속시간",
				statValue: 15,
			},
			{
				description: "치명타 확률이 12% 증가하는 버프를 획득",
				iconValue: 30,
				mpCost: 16,
				statLabel: "지속시간",
				statValue: 15,
			},
			{
				description: "치명타 확률이 12% 증가하는 버프를 획득",
				iconValue: 30,
				mpCost: 6,
				statLabel: "지속시간",
				statValue: 15,
			},
		],
	},
	frost_dagger: {
		name: "서리 단검",
		stages: [
			{
				description: "가까운 적을 향해 날아가 폭발하는 단검을 4개 소환",
				iconValue: 10,
				mpCost: 10,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "얼음속성 피해 90%",
			},
			{
				description: "가까운 적을 향해 날아가 폭발하는 단검을 4개 소환",
				iconValue: 10,
				mpCost: 11,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "얼음속성 피해 135%",
			},
			{
				description: "가까운 적을 향해 날아가 폭발하는 단검을 4개 소환",
				iconValue: 10,
				mpCost: 12,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "얼음속성 피해 180%",
			},
			{
				description: "가까운 적을 향해 날아가 폭발하는 단검을 4개 소환",
				iconValue: 10,
				mpCost: 13,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "얼음속성 피해 220%",
			},
			{
				description: "가까운 적을 향해 날아가 폭발하는 단검을 4개 소환",
				iconValue: 10,
				mpCost: 14,
				statLabel: "피해량",
				statValue: 25,
				statAccent: "얼음속성 피해 260%",
			},
		],
	},
	fire_arrow: {
		name: "파이어 애로우",
		stages: [
			{
				description: "적을 관통하는 화살을 발사",
				iconValue: 9,
				mpCost: 15,
				statLabel: "피해량",
				statValue: 18,
				statAccent: "화염속성 피해 120%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "화상 중첩",
					value: 2,
					icon: "/keywords/FlameGround.png",
				},
			},
			{
				description: "적을 관통하는 화살을 발사",
				iconValue: 9,
				mpCost: 17,
				statLabel: "피해량",
				statValue: 20,
				statAccent: "화염속성 피해 240%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "화상 중첩",
					value: 2,
					icon: "/keywords/FlameGround.png",
				},
			},
			{
				description: "적을 관통하는 화살을 발사",
				iconValue: 9,
				mpCost: 19,
				statLabel: "피해량",
				statValue: 22,
				statAccent: "화염속성 피해 360%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "화상 중첩",
					value: 2,
					icon: "/keywords/FlameGround.png",
				},
			},
		],
	},
	haste: {
		name: "헤이스트",
		stages: [
			{
				description: "공격 속도와 이동 속도를 15% 증가시키는 버프를 획득",
				iconValue: 38,
				mpCost: 36,
				statLabel: "지속시간",
				statValue: 24,
			},
			{
				description: "공격 속도와 이동 속도를 15% 증가시키는 버프를 획득",
				iconValue: 38,
				mpCost: 24,
				statLabel: "지속시간",
				statValue: 24,
			},
			{
				description: "공격 속도와 이동 속도를 15% 증가시키는 버프를 획득",
				iconValue: 38,
				mpCost: 12,
				statLabel: "지속시간",
				statValue: 24,
			},
		],
	},
	fire_circus: {
		name: "불 서커스",
		stages: [
			{
				description: "목표 지점으로 날아가는 8개의 화염 구체 소환",
				iconValue: 10,
				mpCost: 16,
				statLabel: "피해량",
				statValue: 18,
				statAccent: "화염속성 피해 55%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "보너스",
					value: "+10%",
					icon: "/keywords/CriticalChance.png",
				},
			},
			{
				description: "목표 지점으로 날아가는 8개의 화염 구체 소환",
				iconValue: 10,
				mpCost: 18,
				statLabel: "피해량",
				statValue: 18,
				statAccent: "화염속성 피해 75%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "보너스",
					value: "+16%",
					icon: "/keywords/CriticalChance.png",
				},
			},
			{
				description: "목표 지점으로 날아가는 8개의 화염 구체 소환",
				iconValue: 10,
				mpCost: 19,
				statLabel: "피해량",
				statValue: 18,
				statAccent: "화염속성 피해 100%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "보너스",
					value: "+22%",
					icon: "/keywords/CriticalChance.png",
				},
			},
			{
				description: "목표 지점으로 날아가는 8개의 화염 구체 소환",
				iconValue: 10,
				mpCost: 20,
				statLabel: "피해량",
				statValue: 18,
				statAccent: "화염속성 피해 130%",
				statAccentClassName: "text-orange-400",
				secondaryStat: {
					label: "보너스",
					value: "+30%",
					icon: "/keywords/CriticalChance.png",
				},
			},
		],
	},
	arrow_lane: {
		name: "애로우 레인",
		stages: (
			[
				[22, 10, 40],
				[24, 12, 70],
				[26, 14, 100],
				[28, 16, 130],
			] as const
		).map(([mpCost, damage, iceDamage]) => ({
			description:
				"시전 위치에 다수의 얼음 화살을 생성 (적중 시 적에게 일정 확률로 동상 부여)",
			iconValue: 16,
			mpCost,
			stats: [
				{
					label: "피해량",
					value: damage,
					accent: `얼음속성 피해 ${iceDamage}%`,
				},
				{
					label: "동상 확률",
					value: "66%",
					icon: "/keywords/IceDamage.png",
				},
			],
		})),
	},
	thunder: {
		name: "천둥 갑옷",
		stages: (
			[
				[36, 60],
				[33, 70],
				[30, 80],
				[30, 95],
				[30, 110],
			] as const
		).map(([mpCost, lightningDamage]) => ({
			description:
				"번개 갑옷을 생성하며 주변 적을 3회 공격하는 체인 라이트닝을 시전함",
			iconValue: 25,
			mpCost,
			stats: [
				{ label: "지속시간", value: 10 },
				{
					label: "피해량",
					value: 2,
					accent: `번개속성 피해 ${lightningDamage}%`,
				},
				{ label: "공격주기", value: "0.33" },
			],
		})),
	},
	meteor_shower: {
		name: "메테오 샤워",
		stages: (
			[
				[35, 50, 20],
				[38, 100, 25],
				[41, 180, 30],
				[44, 200, 35],
			] as const
		).map(([mpCost, fireDamage, meteorCount]) => ({
			description: "시전 위치 범위에 무작위로 운석을 떨어뜨림",
			iconValue: 26,
			mpCost,
			stats: [
				{
					label: "피해량",
					value: 22,
					accent: `화염속성 피해 ${fireDamage}%`,
					accentClassName: "text-orange-400",
				},
				{ label: "메테오 개수", value: meteorCount },
			],
		})),
	},
	thunder_judgment: {
		name: "천둥의 심판",
		stages: (
			[
				[24, 100],
				[28, 120],
				[32, 140],
				[36, 160],
				[36, 180],
			] as const
		).map(([mpCost, lightningDamage]) => ({
			description: "거대한 전격 광선을 방출하며 10회 공격",
			iconValue: 25,
			mpCost,
			stats: [
				{
					label: "피해량",
					value: 12,
					accent: `번개속성 피해 ${lightningDamage}%`,
				},
			],
		})),
	},
	lightning_boomerang: {
		name: "번개 부메랑",
		stages: [
			{
				description:
					"전기로 감싼 부메랑을 발사 (돌아오는 부메랑을 회수하면 재사용 대기시간 일부 회복)",
				iconValue: 10,
				mpCost: 9,
				statLabel: "피해량",
				statValue: 30,
				statAccent: "번개속성 피해 180%",
			},
			{
				description:
					"전기로 감싼 부메랑을 발사 (돌아오는 부메랑을 회수하면 재사용 대기시간 일부 회복)",
				iconValue: 10,
				mpCost: 10,
				statLabel: "피해량",
				statValue: 30,
				statAccent: "번개속성 피해 240%",
			},
			{
				description:
					"전기로 감싼 부메랑을 발사 (돌아오는 부메랑을 회수하면 재사용 대기시간 일부 회복)",
				iconValue: 10,
				mpCost: 11,
				statLabel: "피해량",
				statValue: 30,
				statAccent: "번개속성 피해 310%",
			},
			{
				description:
					"전기로 감싼 부메랑을 발사 (돌아오는 부메랑을 회수하면 재사용 대기시간 일부 회복)",
				iconValue: 10,
				mpCost: 12,
				statLabel: "피해량",
				statValue: 30,
				statAccent: "번개속성 피해 380%",
			},
			{
				description:
					"전기로 감싼 부메랑을 발사 (돌아오는 부메랑을 회수하면 재사용 대기시간 일부 회복)",
				iconValue: 10,
				mpCost: 12,
				statLabel: "피해량",
				statValue: 30,
				statAccent: "번개속성 피해 450%",
			},
		],
	},
};

export const hasGrantedSkillPreview = (artifactValue: string) =>
	Boolean(GRANTED_SKILLS[artifactValue]);

export const GrantedSkillPreview = ({
	artifact,
}: {
	artifact: ArtifactInstance["item"];
}) => {
	const skill = GRANTED_SKILLS[artifact.value];
	const [stageIndex, setStageIndex] = useState(0);

	if (!skill) return null;

	const stage = skill.stages[stageIndex];
	const stageStats = getStageStats(stage);
	const isFirstStage = stageIndex === 0;
	const isLastStage = stageIndex === skill.stages.length - 1;

	return (
		<div className="pointer-events-auto relative mt-3 w-full min-w-0 text-slate-100">
			<p className="sr-only" aria-live="polite">
				{skill.name} {stageIndex}단계 성능
			</p>
			<button
				type="button"
				aria-label="이전 단계 보기"
				disabled={isFirstStage}
				onClick={(event) => {
					event.stopPropagation();
					setStageIndex((current) => Math.max(0, current - 1));
				}}
				className="absolute -left-3 top-1/2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-cyan-200 transition-colors hover:bg-white/10 hover:text-cyan-100 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
			>
				<ChevronLeft className="size-5" aria-hidden="true" />
			</button>

			<div className="w-full min-w-0 overflow-hidden rounded-md border border-[#39364d] bg-[#191724] shadow-sm">
				<div className="flex min-w-0 items-center gap-3 px-3 py-2">
					<div className="relative size-12 shrink-0 overflow-hidden rounded-sm border border-[#39364d] bg-[#201e30]">
						<Image
							fill
							unoptimized
							sizes="48px"
							src={getCloudflareUrl(artifact.image || "")}
							alt=""
							className="object-contain p-1"
						/>
					</div>
					<div className="min-w-0 flex-1 text-left text-sm font-semibold">
						{skill.name}
					</div>
					<div className="shrink-0 text-right text-xs tabular-nums">
						<div className="flex items-center justify-end gap-1 text-yellow-100">
							<span>{stage.iconValue}</span>
							<Image
								src="/keywords/CooldownRecovey.png"
								width={16}
								height={16}
								alt="재사용 대기시간"
								className="size-4 object-contain pixelated"
							/>
						</div>
						<div className="mt-1 text-cyan-300">{stage.mpCost} MP</div>
					</div>
				</div>

				<div className="mx-3 border-t border-[#302d41]" />

				<div className="px-3 py-2 text-left text-xs leading-relaxed">
					<div className="whitespace-pre-line text-slate-400">
						{stage.description}
					</div>
					<div className="mt-1 flex flex-col gap-0.5">
						{stageStats.map((stat, index) => (
							<div
								key={`${stat.label}-${index}`}
								className="flex items-center justify-between gap-3"
							>
								<span className="flex items-center gap-1 font-semibold text-slate-100">
									{stat.icon && (
										<Image
											src={stat.icon}
											width={12}
											height={12}
											alt=""
											className="size-3 object-contain pixelated"
										/>
									)}
									{stat.label}
								</span>
								<span className="tabular-nums text-slate-100">
									{stat.value}
									{stat.accent && (
										<>
											{" + "}
											<span className={stat.accentClassName ?? "text-cyan-300"}>
												{stat.accent}
											</span>
										</>
									)}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<button
				type="button"
				aria-label="다음 단계 보기"
				disabled={isLastStage}
				onClick={(event) => {
					event.stopPropagation();
					setStageIndex((current) =>
						Math.min(skill.stages.length - 1, current + 1),
					);
				}}
				className="absolute -right-3 top-1/2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-cyan-200 transition-colors hover:bg-white/10 hover:text-cyan-100 disabled:cursor-default disabled:opacity-20 disabled:hover:bg-transparent"
			>
				<ChevronRight className="size-5" aria-hidden="true" />
			</button>
		</div>
	);
};
