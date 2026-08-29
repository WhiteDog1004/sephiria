"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	Check,
	CheckCircle2,
	Clock3,
	HelpCircle,
	Loader2,
	RotateCcw,
	Share2,
	Star,
	Trophy,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getSlabsEffectHandlers } from "@/src/features/simulator/config/getSlabsEffect";
import { ITEM_SLABS_DATA } from "@/src/features/simulator/config/slabsLists";
import { Button } from "@/src/shared/ui/button";
import { getCloudflareUrl } from "@/src/shared/utils/image";
import type { Database } from "@/types_db";

type ArtifactRow = Database["public"]["Tables"]["artifacts"]["Row"];
type RankingRow = Database["public"]["Tables"]["slab_puzzle_rankings"]["Row"];
type SlotId = `${number}-${number}`;
type Direction = 0 | 1 | 2 | 3;

type PuzzleArtifact = {
	id: string;
	type: "artifact";
	name: string;
	image: string;
	targetLevel: number;
};

type PuzzleSlab = {
	id: string;
	type: "slab";
	value: string;
	name: string;
	image: string;
	rotation: Direction;
	tier: string;
	canRotate: boolean;
};

type PuzzleItem = PuzzleArtifact | PuzzleSlab;
type PuzzleBoard = Partial<Record<SlotId, PuzzleItem>>;
type SolveOptions = {
	artifactCount: number;
	extraSlabs: number;
	maxSolverSlabs: number;
};
type FinalResult = {
	score: number;
	totalMoves: number;
	totalSecondsLeft: number;
	bestStageScore: number;
};
type RankingSubmitState =
	| "idle"
	| "saving"
	| "saved"
	| "not-better"
	| "login"
	| "invalid"
	| "error";

const COLS = 6;
const ROWS = 6;
const STAGE_LIMIT = 3;
const STAGE_SECONDS = 180;
const COUNTDOWN_SECONDS = 3;
const TOTAL_SLOTS = COLS * ROWS;
const MAX_TOTAL_SECONDS_LEFT = STAGE_LIMIT * STAGE_SECONDS;
const BASE_TOTAL_SCORE = Array.from(
	{ length: STAGE_LIMIT },
	(_, index) => 1000 + (index + 1) * 120,
).reduce((total, score) => total + score, 0);
const MAX_STAGE_SCORE = 1000 + STAGE_LIMIT * 120 + STAGE_SECONDS * 10;

const GRID_CONFIG = Array.from({ length: ROWS }, (_, row) => ({
	rows: row,
	cols: COLS,
}));

const MINI_GRID_SIZE = 5;
const MINI_GRID_CONFIG = Array.from({ length: MINI_GRID_SIZE }, (_, row) => ({
	rows: row,
	cols: MINI_GRID_SIZE,
}));

const NEGATIVE_SLAB_VALUES = new Set([
	"sight",
	"advent",
	"exploitation",
	"unity",
	"compete",
	"nurture",
	"joke",
	"tide",
	"disconnection",
	"flag",
	"defender",
]);

const STAGE_CONFIGS = Array.from({ length: STAGE_LIMIT }, (_, index) => ({
	stage: index + 1,
	artifactCount: 7 + index * 2,
	extraSlabs: 8 + index,
	maxSolverSlabs: 30,
	scrambleSwaps: 18 + index * 8,
}));

const getSlotId = (index: number): SlotId =>
	`${Math.floor(index / COLS)}-${index % COLS}`;

const getAllSlots = () =>
	Array.from({ length: TOTAL_SLOTS }, (_, index) => getSlotId(index));

const parseSlot = (slotId: SlotId) => {
	const [row, col] = slotId.split("-").map(Number);
	return { row, col };
};

const seededRandom = (seed: number) => {
	let value = seed % 2147483647;
	if (value <= 0) value += 2147483646;

	return () => {
		value = (value * 16807) % 2147483647;
		return (value - 1) / 2147483646;
	};
};

const getStageSlabPool = () => {
	const allowedTiers = ["common", "advanced"];

	return ITEM_SLABS_DATA.filter(
		(slab) =>
			NEGATIVE_SLAB_VALUES.has(slab.value) && allowedTiers.includes(slab.tier),
	);
};

const getStageHazardPool = () => {
	const allowedTiers = ["common", "advanced"];

	return ITEM_SLABS_DATA.filter(
		(slab) =>
			NEGATIVE_SLAB_VALUES.has(slab.value) && allowedTiers.includes(slab.tier),
	);
};

const shuffle = <T,>(items: T[], random: () => number) => {
	const next = [...items];
	for (let index = next.length - 1; index > 0; index--) {
		const targetIndex = Math.floor(random() * (index + 1));
		[next[index], next[targetIndex]] = [next[targetIndex], next[index]];
	}
	return next;
};

const getThreatValues = (board: PuzzleBoard) => {
	const values = getAllSlots().reduce(
		(acc, slotId) => {
			acc[slotId] = 0;
			return acc;
		},
		{} as Record<SlotId, number>,
	);

	Object.entries(board).forEach(([slotId, item]) => {
		if (!item || item.type !== "slab") return;

		const { row, col } = parseSlot(slotId as SlotId);
		const handler = getSlabsEffectHandlers[item.value];

		if (handler) {
			handler(
				col,
				row,
				slotId,
				{ rotation: item.rotation },
				values,
				undefined,
				GRID_CONFIG,
			);
		}
	});

	return values;
};

const getSlabPreviewValues = (slab: PuzzleSlab) => {
	const effects = Array.from({ length: MINI_GRID_SIZE }).reduce<
		Record<string, number>
	>((acc, _, rowIndex) => {
		Array.from({ length: MINI_GRID_SIZE }).forEach((__, colIndex) => {
			acc[`${rowIndex}-${colIndex}`] = 0;
		});
		return acc;
	}, {});
	const previewPositions: Record<string, { col: number; row: number }> = {
		linear: { col: 2, row: 4 },
		shade: { col: 2, row: 0 },
		justice: { col: 0, row: 2 },
		compression: { col: 2, row: 3 },
		junction: { col: 1, row: 3 },
		flag: { col: 0, row: 2 },
	};
	const position = previewPositions[slab.value] ?? { col: 2, row: 2 };
	const currentSlotId = `${position.row}-${position.col}`;
	const handler = getSlabsEffectHandlers[slab.value];

	if (handler) {
		handler(
			position.col,
			position.row,
			currentSlotId,
			{ rotation: slab.rotation },
			effects,
			undefined,
			MINI_GRID_CONFIG,
		);
	}

	return { currentSlotId, effects };
};

const getThreatenedSlots = (board: PuzzleBoard) => {
	const values = getThreatValues(board);
	return new Set(
		Object.entries(values)
			.filter(([, value]) => value < 0)
			.map(([slotId]) => slotId as SlotId),
	);
};

const getIncompleteArtifacts = (board: PuzzleBoard) => {
	const effectValues = getThreatValues(board);

	return Object.entries(board)
		.filter((entry): entry is [SlotId, PuzzleArtifact] => {
			const [slotId, item] = entry as [SlotId, PuzzleItem];
			return (
				item.type === "artifact" && effectValues[slotId] < item.targetLevel
			);
		})
		.map(([slotId]) => slotId);
};

const getTotalDeficit = (board: PuzzleBoard) => {
	const effectValues = getThreatValues(board);

	return Object.entries(board).reduce((total, [slotId, item]) => {
		if (!item || item.type !== "artifact") return total;
		const finalLevel = effectValues[slotId as SlotId];
		return total + Math.max(0, item.targetLevel - finalLevel);
	}, 0);
};

const createArtifactItem = (
	artifact: ArtifactRow | undefined,
	index: number,
	stage: number,
): PuzzleArtifact => ({
	id: `stage-${stage}-artifact-${index}`,
	type: "artifact",
	name: artifact?.label_kor || `Artifact ${index + 1}`,
	image: artifact?.image || "/inventory.png",
	targetLevel: Number(artifact?.level ?? 1),
});

const createSolvedBoard = (
	artifacts: ArtifactRow[],
	stage: number,
	random: () => number,
	options: SolveOptions = STAGE_CONFIGS[stage - 1],
) => {
	const slots = getAllSlots();
	const playableArtifacts = artifacts.filter(
		(artifact) => Number(artifact.level) > 0,
	);
	const shuffledArtifacts = shuffle(
		playableArtifacts.length > 0 ? playableArtifacts : artifacts,
		random,
	);
	const artifactCandidates = slots.filter((slotId) => {
		const { row, col } = parseSlot(slotId);
		return (row + col) % 2 === stage % 2;
	});
	const artifactSlots = new Set(
		shuffle(artifactCandidates, random).slice(0, options.artifactCount),
	);
	let board: PuzzleBoard = {} as PuzzleBoard;
	const slabPool = getStageSlabPool();
	const hazardPool = getStageHazardPool();

	Array.from(artifactSlots).forEach((slotId, index) => {
		board[slotId] = createArtifactItem(
			shuffledArtifacts[index % Math.max(shuffledArtifacts.length, 1)],
			index,
			stage,
		);
	});

	let slabIndex = 0;

	while (getTotalDeficit(board) > 0 && slabIndex < options.maxSolverSlabs) {
		const emptySlots = shuffle(
			slots.filter((slotId) => !board[slotId]),
			random,
		);
		const candidates = shuffle(slabPool, random);
		const rotations = shuffle([0, 1, 2, 3] as Direction[], random);
		let bestBoard = board;
		let bestDeficit = getTotalDeficit(board);

		for (const slotId of emptySlots) {
			for (const slab of candidates) {
				const candidateRotations = slab.rotate
					? rotations
					: ([0] as Direction[]);

				for (const rotation of candidateRotations) {
					const candidateBoard: PuzzleBoard = {
						...board,
						[slotId]: {
							id: `stage-${stage}-slab-${slabIndex}`,
							type: "slab",
							value: slab.value,
							name: slab.ko_label || slab.eng_label,
							image: slab.image,
							rotation,
							tier: slab.tier,
							canRotate: slab.rotate === true,
						},
					};
					const deficit = getTotalDeficit(candidateBoard);

					if (deficit < bestDeficit) {
						bestBoard = candidateBoard;
						bestDeficit = deficit;
					}
				}
			}
		}

		if (bestBoard === board) break;
		board = bestBoard;
		slabIndex++;
	}

	const usedSlabValues = new Set(
		Object.values(board)
			.filter((item): item is PuzzleSlab => item?.type === "slab")
			.map((item) => item.value),
	);

	for (let index = 0; index < options.extraSlabs; index++) {
		const emptySlots = slots.filter((slotId) => !board[slotId]);
		if (emptySlots.length === 0) break;

		const slotId = shuffle(emptySlots, random)[0];
		const pool =
			hazardPool.length > 0 && index % 2 === 0 ? hazardPool : slabPool;
		const shuffledPool = shuffle(pool, random);
		const slab =
			shuffledPool.find((candidate) => !usedSlabValues.has(candidate.value)) ??
			shuffledPool[0];
		const rotation = slab.rotate ? (Math.floor(random() * 4) as Direction) : 0;

		board[slotId] = {
			id: `stage-${stage}-extra-slab-${index}`,
			type: "slab",
			value: slab.value,
			name: slab.ko_label || slab.eng_label,
			image: slab.image,
			rotation,
			tier: slab.tier,
			canRotate: slab.rotate === true,
		};

		if (getTotalDeficit(board) > 0) {
			delete board[slotId];
		} else {
			usedSlabValues.add(slab.value);
		}
	}

	return board;
};

const swapBoardItems = (board: PuzzleBoard, from: SlotId, to: SlotId) => {
	if (from === to) return board;

	const next = { ...board };
	const fromItem = next[from];
	const toItem = next[to];

	if (toItem) {
		next[from] = toItem;
	} else {
		delete next[from];
	}

	if (fromItem) {
		next[to] = fromItem;
	}

	return next;
};

const ensureUniqueItemIds = (board: PuzzleBoard, stage: number) => {
	const next: PuzzleBoard = {};

	getAllSlots().forEach((slotId, index) => {
		const item = board[slotId];
		if (!item) return;

		next[slotId] = {
			...item,
			id: `stage-${stage}-${item.type}-${index}-${slotId}`,
		};
	});

	return next;
};

const createEmergencySolvedBoard = (
	artifacts: ArtifactRow[],
	stage: number,
): PuzzleBoard => {
	const artifact =
		artifacts.find((item) => Number(item.level) > 0) ?? artifacts[0];
	const board: PuzzleBoard = {
		"2-2": createArtifactItem(artifact, 0, stage),
	};
	const supportSlab =
		ITEM_SLABS_DATA.find((slab) => slab.value === "compete") ??
		ITEM_SLABS_DATA.find((slab) => NEGATIVE_SLAB_VALUES.has(slab.value)) ??
		ITEM_SLABS_DATA[0];

	board["1-2"] = {
		id: `stage-${stage}-emergency-top`,
		type: "slab",
		value: supportSlab.value,
		name: supportSlab.ko_label || supportSlab.eng_label,
		image: supportSlab.image,
		rotation: 0,
		tier: supportSlab.tier,
		canRotate: supportSlab.rotate === true,
	};

	return ensureUniqueItemIds(board, stage);
};

const createGuaranteedSolvedBoard = (
	artifacts: ArtifactRow[],
	stage: number,
	baseSeed: number,
) => {
	const config = STAGE_CONFIGS[stage - 1];
	const optionAttempts: SolveOptions[] = [
		config,
		{
			...config,
			maxSolverSlabs: 34,
			extraSlabs: config.extraSlabs + 4,
		},
		{
			...config,
			artifactCount: Math.max(2, config.artifactCount - 1),
			maxSolverSlabs: 34,
			extraSlabs: config.extraSlabs + 6,
		},
		{
			...config,
			artifactCount: Math.max(1, config.artifactCount - 2),
			maxSolverSlabs: 35,
			extraSlabs: config.extraSlabs + 8,
		},
	];

	let bestBoard: PuzzleBoard | null = null;
	let bestDeficit = Number.POSITIVE_INFINITY;

	for (const [optionIndex, options] of optionAttempts.entries()) {
		for (let attempt = 0; attempt < 80; attempt++) {
			const random = seededRandom(baseSeed + optionIndex * 1009 + attempt * 37);
			const board = createSolvedBoard(artifacts, stage, random, options);
			const deficit = getTotalDeficit(board);

			if (deficit === 0) {
				return ensureUniqueItemIds(board, stage);
			}

			if (deficit < bestDeficit) {
				bestBoard = board;
				bestDeficit = deficit;
			}
		}
	}

	const emergencyOptions: SolveOptions = {
		artifactCount: 1,
		extraSlabs: 12,
		maxSolverSlabs: 35,
	};

	for (let attempt = 0; attempt < 200; attempt++) {
		const random = seededRandom(baseSeed + 90000 + attempt * 53);
		const board = createSolvedBoard(artifacts, stage, random, emergencyOptions);

		if (getTotalDeficit(board) === 0) {
			return ensureUniqueItemIds(board, stage);
		}
	}

	if (bestBoard) {
		const emergencyBoard = createEmergencySolvedBoard(artifacts, stage);
		if (getTotalDeficit(emergencyBoard) === 0) {
			return emergencyBoard;
		}

		return ensureUniqueItemIds(bestBoard, stage);
	}

	return createEmergencySolvedBoard(artifacts, stage);
};

const createStageBoard = (artifacts: ArtifactRow[], stage: number) => {
	const seed = Date.now() + stage * 9973;
	const random = seededRandom(seed);
	const solvedBoard = createGuaranteedSolvedBoard(artifacts, stage, seed);
	const slots = getAllSlots();
	const config = STAGE_CONFIGS[stage - 1];

	for (let attempt = 0; attempt < 80; attempt++) {
		let board = { ...solvedBoard };

		for (let swapIndex = 0; swapIndex < config.scrambleSwaps; swapIndex++) {
			const from = slots[Math.floor(random() * slots.length)];
			const to = slots[Math.floor(random() * slots.length)];
			board = swapBoardItems(board, from, to);
		}

		if (getTotalDeficit(board) > 0) {
			return ensureUniqueItemIds(board, stage);
		}
	}

	return ensureUniqueItemIds(
		swapBoardItems(solvedBoard, slots[0], slots[TOTAL_SLOTS - 1]),
		stage,
	);
};

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

const getStageScore = (stage: number, secondsLeft: number, moves: number) =>
	Math.max(100, 1000 + stage * 120 + secondsLeft * 10 - moves * 5);

const isValidRankingResult = (result: FinalResult) => {
	const maxScore =
		BASE_TOTAL_SCORE + result.totalSecondsLeft * 10 - result.totalMoves * 5;

	return (
		result.score >= STAGE_LIMIT * 100 &&
		result.score <= maxScore &&
		result.totalMoves >= 0 &&
		result.totalSecondsLeft >= 0 &&
		result.totalSecondsLeft <= MAX_TOTAL_SECONDS_LEFT &&
		result.bestStageScore >= 0 &&
		result.bestStageScore <= MAX_STAGE_SCORE
	);
};

const getSlabBorderClass = (item?: PuzzleItem) => {
	if (!item || item.type !== "slab") return "border-stone-950/60";

	switch (item.tier) {
		case "advanced":
			return "border-blue-300";
		case "rare":
			return "border-yellow-300";
		case "legend":
			return "border-pink-400";
		default:
			return "border-stone-950/60";
	}
};

const PuzzleSlot = ({
	slotId,
	item,
	isThreatened,
	isIncomplete,
	effectValue,
	onRotate,
	onSelectSlab,
}: {
	slotId: SlotId;
	item?: PuzzleItem;
	isThreatened: boolean;
	isIncomplete: boolean;
	effectValue: number;
	onRotate: (itemId: string) => void;
	onSelectSlab: (slab: PuzzleSlab) => void;
}) => {
	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id: slotId,
		data: { type: "slot" },
	});
	const {
		attributes,
		listeners,
		setNodeRef: setDragRef,
		transform,
		isDragging,
	} = useDraggable({
		id: item?.id ?? `empty-${slotId}`,
		data: { slotId, item },
		disabled: !item,
	});
	const style = transform
		? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
		: undefined;
	const artifactFinalLevel = item?.type === "artifact" ? effectValue : null;
	const artifactTargetLevel =
		item?.type === "artifact" ? item.targetLevel : null;
	const isArtifactMaxed =
		artifactFinalLevel !== null &&
		artifactTargetLevel !== null &&
		artifactFinalLevel >= artifactTargetLevel;

	return (
		<div
			ref={setDropRef}
			className={`relative aspect-square rounded-sm border-2 p-1 transition-colors ${
				isOver ? "border-amber-300 bg-amber-200/20" : getSlabBorderClass(item)
			} ${
				item?.type === "artifact"
					? "bg-stone-700"
					: item?.type === "slab"
						? "bg-zinc-900"
						: "bg-stone-900"
			} ${isIncomplete ? "ring-4 ring-amber-400" : ""}`}
		>
			{item ? (
				<div
					ref={setDragRef}
					style={style}
					{...listeners}
					{...attributes}
					className={`relative h-full w-full cursor-grab touch-none rounded-sm active:cursor-grabbing ${
						isDragging ? "opacity-30" : "opacity-100"
					}`}
				>
					<Image
						fill
						unoptimized
						src={getCloudflareUrl(item.image)}
						alt={item.name}
						className="object-contain p-1"
						style={
							item.type === "slab" && item.canRotate
								? { transform: `rotate(${item.rotation * 90}deg)` }
								: undefined
						}
					/>
					{item.type === "slab" && (
						<button
							type="button"
							className="absolute inset-0 z-10 cursor-grab rounded-sm bg-transparent"
							aria-label={`${item.name} 정보 보기`}
							onClick={() => onSelectSlab(item)}
						/>
					)}
					{item.type === "slab" && item.canRotate && (
						<button
							type="button"
							className="absolute right-0 top-0 z-20 flex size-4 items-center justify-center rounded-full bg-black/75 text-white shadow hover:bg-black sm:size-5 md:size-6"
							onClick={(event) => {
								event.stopPropagation();
								onRotate(item.id);
							}}
							onPointerDown={(event) => event.stopPropagation()}
							title="Rotate slab"
						>
							<RotateCcw className="size-2 sm:size-3 md:size-4" />
						</button>
					)}
				</div>
			) : (
				<div className="h-full w-full rounded-sm border border-stone-700/70 bg-stone-950/40" />
			)}
			{item && isThreatened && item.type === "artifact" && (
				<div className="pointer-events-none absolute inset-1 rounded-sm border border-red-400/80 bg-red-500/15" />
			)}
			{effectValue !== 0 && (
				<div
					className={`pointer-events-none absolute left-0 top-0 z-30 flex items-start gap-1 px-1 py-0.5 text-xs font-bold md:text-sm ${
						item?.type === "artifact"
							? isArtifactMaxed
								? "text-emerald-300"
								: "text-amber-300"
							: effectValue > 0
								? "text-emerald-300"
								: "text-red-300"
					}`}
				>
					<span>
						{item?.type === "artifact" ? artifactFinalLevel : effectValue}
					</span>
					{item?.type === "artifact" && (
						<>
							<span>/</span>
							<span>{item.targetLevel}</span>
						</>
					)}
				</div>
			)}
			{item?.type === "artifact" && (
				<>
					{effectValue === 0 && (
						<div
							className={`pointer-events-none absolute left-0 top-0 z-30 px-1 py-0.5 text-xs font-bold md:text-sm ${
								isArtifactMaxed ? "text-emerald-300" : "text-amber-300"
							}`}
						>
							0 / {item.targetLevel}
						</div>
					)}
					<div className="pointer-events-none absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-white">
						{item.name}
					</div>
				</>
			)}
		</div>
	);
};

const OverlayItem = ({ item }: { item: PuzzleItem }) => (
	<div className="relative size-16 rounded-sm border-2 border-amber-300 bg-zinc-900 p-1 shadow-2xl">
		<Image
			fill
			unoptimized
			src={getCloudflareUrl(item.image)}
			alt={item.name}
			className="object-contain p-1"
			style={
				item.type === "slab" && item.canRotate
					? { transform: `rotate(${item.rotation * 90}deg)` }
					: undefined
			}
		/>
	</div>
);

const SelectedSlabPanel = ({ slab }: { slab: PuzzleSlab | null }) => {
	const preview = useMemo(
		() => (slab ? getSlabPreviewValues(slab) : null),
		[slab],
	);

	if (!slab || !preview) {
		return (
			<div className="rounded-sm border border-border bg-card p-3 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
				<p className="text-xs text-muted-foreground dark:text-stone-400">
					Slab info
				</p>
				<p className="mt-1 text-xs text-foreground dark:text-stone-300">
					석판을 클릭하면 효과 정보가 표시됩니다.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-sm border border-border bg-card p-3 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
			<div className="flex items-center gap-2">
				<div className="relative size-9 rounded-sm bg-muted p-1 dark:bg-zinc-950">
					<Image
						fill
						unoptimized
						src={getCloudflareUrl(slab.image)}
						alt={slab.name}
						className="object-contain p-1"
						style={
							slab.canRotate
								? { transform: `rotate(${slab.rotation * 90}deg)` }
								: undefined
						}
					/>
				</div>
				<div className="min-w-0">
					<p className="truncate text-sm font-bold text-card-foreground dark:text-stone-100">
						{slab.name}
					</p>
					<p className="text-[10px] uppercase text-muted-foreground dark:text-stone-400">
						{slab.tier}
					</p>
				</div>
			</div>

			<div className="mt-3 grid w-max grid-cols-5 gap-1 rounded-sm border border-border bg-muted p-1.5 dark:border-stone-700 dark:bg-stone-950">
				{Array.from({ length: MINI_GRID_SIZE }).map((_, rowIndex) =>
					Array.from({ length: MINI_GRID_SIZE }).map((__, colIndex) => {
						const slotId = `${rowIndex}-${colIndex}`;
						const effectValue = preview.effects[slotId] ?? 0;
						const isCurrent = slotId === preview.currentSlotId;

						return (
							<div
								key={slotId}
								className={`flex size-5 items-center justify-center rounded-sm text-[10px] font-bold ${
									isCurrent
										? "bg-amber-400 text-stone-950"
										: effectValue > 0
											? "bg-emerald-500 text-white"
											: effectValue < 0
												? "bg-red-500 text-white"
												: "bg-gray-300 text-muted-foreground dark:bg-stone-700 dark:text-stone-400"
								}`}
							>
								{isCurrent ? (
									<Star className="size-3 fill-current" />
								) : effectValue > 0 ? (
									`+${effectValue}`
								) : effectValue < 0 ? (
									effectValue
								) : (
									""
								)}
							</div>
						);
					}),
				)}
			</div>

			<p className="mt-2 text-[11px] text-muted-foreground dark:text-stone-400">
				별 표시는 선택한 석판 위치입니다.
			</p>
		</div>
	);
};

const SlabPuzzleGame = ({ artifacts }: { artifacts: ArtifactRow[] }) => {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
	);
	const [stage, setStage] = useState(1);
	const [board, setBoard] = useState<PuzzleBoard>(() =>
		createStageBoard(artifacts, 1),
	);
	const [secondsLeft, setSecondsLeft] = useState(STAGE_SECONDS);
	const [moves, setMoves] = useState(0);
	const [totalMoves, setTotalMoves] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);
	const [stageScore, setStageScore] = useState(0);
	const [bestStageScore, setBestStageScore] = useState(0);
	const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
	const [activeItem, setActiveItem] = useState<PuzzleItem | null>(null);
	const [selectedSlab, setSelectedSlab] = useState<PuzzleSlab | null>(null);
	const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
	const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
	const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);
	const [isRankingOpen, setIsRankingOpen] = useState(false);
	const [isShareCopied, setIsShareCopied] = useState(false);
	const [rankings, setRankings] = useState<RankingRow[]>([]);
	const [rankingError, setRankingError] = useState<string | null>(null);
	const [isRankingsLoading, setIsRankingsLoading] = useState(false);
	const [rankingSubmitState, setRankingSubmitState] =
		useState<RankingSubmitState>("idle");
	const [status, setStatus] = useState<
		"ready" | "countdown" | "playing" | "clear" | "done" | "failed"
	>("ready");

	const threatValues = useMemo(() => getThreatValues(board), [board]);
	const threatenedSlots = useMemo(() => getThreatenedSlots(board), [board]);
	const incompleteArtifacts = useMemo(
		() => getIncompleteArtifacts(board),
		[board],
	);
	const isCleared = incompleteArtifacts.length === 0;
	const isBoardVisible =
		status === "playing" || status === "clear" || status === "done";

	const resetToReady = useCallback(() => {
		setStage(1);
		setBoard(createStageBoard(artifacts, 1));
		setSecondsLeft(STAGE_SECONDS);
		setMoves(0);
		setTotalMoves(0);
		setTotalScore(0);
		setTotalSecondsLeft(0);
		setStageScore(0);
		setBestStageScore(0);
		setFinalResult(null);
		setCountdown(COUNTDOWN_SECONDS);
		setStatus("ready");
		setActiveItem(null);
		setSelectedSlab(null);
		setIsHowToPlayOpen(false);
		setIsLoginNoticeOpen(false);
		setIsRankingOpen(false);
		setRankingSubmitState("idle");
	}, [artifacts]);

	const beginGame = useCallback(() => {
		setStage(1);
		setBoard(createStageBoard(artifacts, 1));
		setSecondsLeft(STAGE_SECONDS);
		setMoves(0);
		setTotalMoves(0);
		setTotalScore(0);
		setTotalSecondsLeft(0);
		setStageScore(0);
		setBestStageScore(0);
		setFinalResult(null);
		setCountdown(COUNTDOWN_SECONDS);
		setStatus("countdown");
		setActiveItem(null);
		setSelectedSlab(null);
		setIsHowToPlayOpen(false);
		setIsLoginNoticeOpen(false);
		setIsRankingOpen(false);
		setRankingSubmitState("idle");
	}, [artifacts]);

	const startGame = useCallback(async () => {
		const supabase = createBrowserSupabaseClient();
		const { data } = await supabase.auth.getSession();

		if (!data.session) {
			setIsHowToPlayOpen(false);
			setIsRankingOpen(false);
			setIsLoginNoticeOpen(true);
			return;
		}

		beginGame();
	}, [beginGame]);

	const copyShareUrl = useCallback(async () => {
		const shareUrl = `${window.location.origin}/slab-puzzle`;

		try {
			await navigator.clipboard.writeText(shareUrl);
			setIsShareCopied(true);
			window.setTimeout(() => setIsShareCopied(false), 1800);
		} catch (error) {
			console.error("Failed to copy slab puzzle url", error);
		}
	}, []);

	const startStage = useCallback(
		(nextStage: number) => {
			setStage(nextStage);
			setBoard(createStageBoard(artifacts, nextStage));
			setSecondsLeft(STAGE_SECONDS);
			setMoves(0);
			setStageScore(0);
			setCountdown(COUNTDOWN_SECONDS);
			setStatus("countdown");
			setActiveItem(null);
			setSelectedSlab(null);
			setIsRankingOpen(false);
		},
		[artifacts],
	);

	const loadRankings = useCallback(async () => {
		setIsRankingOpen(true);
		setRankingError(null);
		setIsRankingsLoading(true);

		try {
			const response = await fetch("/api/slab-puzzle/rankings", {
				cache: "no-store",
			});
			const result = (await response.json()) as {
				rankings?: RankingRow[];
				message?: string;
			};

			if (!response.ok) {
				throw new Error(result.message ?? "랭킹을 불러오지 못했습니다.");
			}

			setRankings(result.rankings ?? []);
		} catch (error) {
			setRankingError(
				error instanceof Error ? error.message : "랭킹을 불러오지 못했습니다.",
			);
		} finally {
			setIsRankingsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (status !== "countdown") return;

		const timerId = window.setInterval(() => {
			setCountdown((current) => {
				if (current <= 1) {
					window.clearInterval(timerId);
					window.setTimeout(() => setStatus("playing"), 0);
					return 0;
				}

				return current - 1;
			});
		}, 1000);

		return () => window.clearInterval(timerId);
	}, [status]);

	useEffect(() => {
		if (status !== "playing") return;

		const timerId = window.setInterval(() => {
			setSecondsLeft((current) => {
				if (current <= 1) {
					window.clearInterval(timerId);
					window.setTimeout(() => setStatus("failed"), 0);
					return 0;
				}
				return current - 1;
			});
		}, 1000);

		return () => window.clearInterval(timerId);
	}, [status]);

	useEffect(() => {
		if (!isCleared || status !== "playing") return;

		const score = getStageScore(stage, secondsLeft, moves);
		const nextTotalScore = totalScore + score;
		const nextTotalSecondsLeft = totalSecondsLeft + secondsLeft;
		const nextBestStageScore = Math.max(bestStageScore, score);
		setStageScore(score);
		setTotalScore(nextTotalScore);
		setTotalSecondsLeft(nextTotalSecondsLeft);
		setBestStageScore(nextBestStageScore);

		if (stage >= STAGE_LIMIT) {
			setFinalResult({
				score: nextTotalScore,
				totalMoves,
				totalSecondsLeft: nextTotalSecondsLeft,
				bestStageScore: nextBestStageScore,
			});
			setStatus("done");
			return;
		}

		setStatus("clear");
	}, [
		isCleared,
		moves,
		bestStageScore,
		secondsLeft,
		stage,
		status,
		totalMoves,
		totalScore,
		totalSecondsLeft,
	]);

	useEffect(() => {
		if (status !== "done" || !finalResult || rankingSubmitState !== "idle")
			return;

		const saveRanking = async () => {
			setRankingSubmitState("saving");

			try {
				if (!isValidRankingResult(finalResult)) {
					setRankingSubmitState("invalid");
					return;
				}

				const supabase = createBrowserSupabaseClient();
				const { data } = await supabase.auth.getSession();

				if (!data.session) {
					setRankingSubmitState("login");
					return;
				}

				const response = await fetch("/api/slab-puzzle/rankings", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						score: finalResult.score,
						clearedStages: STAGE_LIMIT,
						totalMoves: finalResult.totalMoves,
						totalSecondsLeft: finalResult.totalSecondsLeft,
						bestStageScore: finalResult.bestStageScore,
					}),
				});
				const result = (await response.json()) as {
					saved?: boolean;
					code?: string;
					message?: string;
				};

				if (response.status === 401) {
					setRankingSubmitState("login");
					return;
				}

				if (!response.ok) {
					if (result.code === "IRREGULAR_SCORE") {
						setRankingSubmitState("invalid");
						return;
					}

					throw new Error(result.message ?? "랭킹 저장에 실패했습니다.");
				}

				setRankingSubmitState(result.saved === false ? "not-better" : "saved");
			} catch (error) {
				console.error("Failed to save slab puzzle ranking", error);
				setRankingSubmitState("error");
			}
		};

		saveRanking();
	}, [finalResult, rankingSubmitState, status]);

	useEffect(() => {
		if (status !== "clear") return;

		const timerId = window.setTimeout(() => {
			startStage(stage + 1);
		}, 1200);

		return () => window.clearTimeout(timerId);
	}, [stage, status, startStage]);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveItem(event.active.data.current?.item ?? null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveItem(null);
		if (!over || status !== "playing") return;

		const from = active.data.current?.slotId as SlotId | undefined;
		const to = over.id as SlotId;
		if (!from || from === to) return;

		setBoard((current) => {
			const next = swapBoardItems(current, from, to);
			setSelectedSlab((selected) => {
				if (!selected) return selected;
				const movedSlab = Object.values(next).find(
					(item): item is PuzzleSlab =>
						item?.type === "slab" && item.id === selected.id,
				);
				return movedSlab ?? null;
			});
			return next;
		});
		setMoves((current) => current + 1);
		setTotalMoves((current) => current + 1);
	};

	const handleRotate = (itemId: string) => {
		if (status !== "playing") return;

		setBoard((current) => {
			const next = { ...current };
			const targetSlot = Object.keys(next).find(
				(slotId) => next[slotId as SlotId]?.id === itemId,
			) as SlotId | undefined;
			if (!targetSlot) return current;
			const item = next[targetSlot];
			if (!item || item.type !== "slab" || !item.canRotate) return current;

			next[targetSlot] = {
				...item,
				rotation: ((item.rotation + 1) % 4) as Direction,
			};
			setSelectedSlab((current) =>
				current?.id === itemId ? (next[targetSlot] as PuzzleSlab) : current,
			);
			return next;
		});
		setMoves((current) => current + 1);
		setTotalMoves((current) => current + 1);
	};

	return (
		<main className="min-h-screen bg-background px-3 py-6 text-foreground md:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
				<header className="flex flex-col items-center gap-4 border-b border-border pb-5 text-center dark:border-stone-700">
					<div>
						<p className="text-sm font-semibold text-gray-300 dark:text-gray-300/40">
							Inventory Game. Test Version
						</p>
						<h1 className="text-2xl font-bold md:text-3xl">
							서둘러라! 인벤토리 퍼즐
						</h1>
					</div>
					<div className="grid w-full max-w-xl grid-cols-2 gap-2 text-left text-sm md:grid-cols-4">
						<div className="rounded-sm border border-border bg-card px-3 py-2 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
							<p className="text-muted-foreground dark:text-stone-400">Stage</p>
							<p className="font-bold">
								{stage} / {STAGE_LIMIT}
							</p>
						</div>
						<div className="rounded-sm border border-border bg-card px-3 py-2 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
							<p className="flex items-center gap-1 text-muted-foreground dark:text-stone-400">
								<Clock3 className="size-4" /> Time
							</p>
							<p className="font-bold">{formatTime(secondsLeft)}</p>
						</div>
						<div className="rounded-sm border border-border bg-card px-3 py-2 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
							<p className="text-muted-foreground dark:text-stone-400">Moves</p>
							<p className="font-bold">{moves}</p>
						</div>
						<div className="rounded-sm border border-border bg-card px-3 py-2 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
							<p className="flex items-center gap-1 text-muted-foreground dark:text-stone-400">
								<Trophy className="size-4" /> Score
							</p>
							<p className="font-bold">{totalScore}</p>
						</div>
					</div>
				</header>

				<section className="grid items-start gap-5 lg:grid-cols-[minmax(0,520px)_280px] lg:justify-center">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<div className="relative mx-auto grid aspect-square w-full max-w-[312px] grid-cols-6 gap-1 overflow-hidden rounded-sm bg-[#2a201c] p-2 shadow-xl sm:max-w-[360px] md:max-w-[456px] md:gap-2 md:p-3">
							{isBoardVisible ? (
								getAllSlots().map((slotId) => {
									const item = board[slotId];
									return (
										<PuzzleSlot
											key={slotId}
											slotId={slotId}
											item={item}
											isThreatened={threatenedSlots.has(slotId)}
											isIncomplete={incompleteArtifacts.includes(slotId)}
											effectValue={threatValues[slotId] ?? 0}
											onRotate={handleRotate}
											onSelectSlab={setSelectedSlab}
										/>
									);
								})
							) : (
								<>
									<Image
										fill
										priority
										src="/Sephiria_Keyart_NoTitle.png"
										alt="Sephiria"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-black/35" />
								</>
							)}
							{status === "ready" && (
								<div className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-sm">
									<p className="mb-5 text-sm font-bold tracking-[0.25em] text-amber-200 drop-shadow">
										INVENTORY PUZZLE
									</p>
									<Button
										type="button"
										className="slab-puzzle-start-button border-2 border-white bg-amber-400 px-10 py-6 text-lg font-black text-black shadow-[0_0_24px_rgba(251,191,36,0.7)] hover:bg-amber-300 dark:text-white"
										onClick={startGame}
									>
										START
									</Button>
									<Button
										type="button"
										className="mt-4 border border-amber-200/80 bg-stone-950/75 px-5 py-2 text-xs font-bold text-amber-100 shadow hover:bg-stone-900"
										onClick={() => setIsHowToPlayOpen(true)}
									>
										<HelpCircle className="mr-2 size-4" />
										HOW TO PLAY
									</Button>
									<Button
										type="button"
										className="mt-2 border border-emerald-200/80 bg-stone-950/75 px-5 py-2 text-xs font-bold text-emerald-100 shadow hover:bg-stone-900"
										onClick={loadRankings}
									>
										<Trophy className="mr-2 size-4" />
										RANKING
									</Button>
								</div>
							)}
							{status === "ready" &&
								!isHowToPlayOpen &&
								!isLoginNoticeOpen &&
								!isRankingOpen && (
									<div className="absolute bottom-3 right-3 z-50">
										<button
											type="button"
											className={`flex size-9 items-center justify-center rounded-full border bg-stone-950/80 shadow transition-colors hover:bg-stone-900 ${
												isShareCopied
													? "border-emerald-300/80 text-emerald-300"
													: "border-amber-200/70 text-amber-100"
											}`}
											onClick={copyShareUrl}
											aria-label="공유 링크 복사"
											title="공유 링크 복사"
										>
											<AnimatePresence mode="wait" initial={false}>
												<motion.span
													key={isShareCopied ? "copied" : "share"}
													initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
													animate={{ opacity: 1, scale: 1, rotate: 0 }}
													exit={{ opacity: 0, scale: 0.55, rotate: 18 }}
													transition={{ duration: 0.18, ease: "easeOut" }}
												>
													{isShareCopied ? (
														<Check className="size-4" />
													) : (
														<Share2 className="size-4" />
													)}
												</motion.span>
											</AnimatePresence>
										</button>
									</div>
								)}
							{status === "ready" && isRankingOpen && (
								<div className="absolute inset-0 z-50 flex items-center justify-center rounded-sm bg-black/45 px-3">
									<div className="slab-puzzle-ready-text w-full max-w-sm rounded-sm border border-emerald-300/70 bg-stone-950/90 p-4 text-stone-100 shadow-[0_0_32px_rgba(52,211,153,0.25)]">
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
													Ranking
												</p>
												<h2 className="mt-1 text-xl font-black">
													인벤토리 퍼즐 순위
												</h2>
											</div>
											<button
												type="button"
												className="flex size-8 items-center justify-center rounded-sm border border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
												onClick={() => setIsRankingOpen(false)}
												aria-label="닫기"
											>
												<X className="size-4" />
											</button>
										</div>

										<div className="mt-4 max-h-64 overflow-y-auto pr-1">
											{isRankingsLoading ? (
												<div className="flex h-32 items-center justify-center text-sm text-stone-300">
													<Loader2 className="mr-2 size-4 animate-spin" />
													랭킹 불러오는 중
												</div>
											) : rankingError ? (
												<div className="rounded-sm border border-red-400/40 bg-red-950/40 p-3 text-xs text-red-100">
													{rankingError}
												</div>
											) : rankings.length === 0 ? (
												<div className="rounded-sm border border-stone-700 bg-stone-900/70 p-3 text-xs text-stone-300">
													아직 등록된 기록이 없습니다.
												</div>
											) : (
												<div className="space-y-2">
													{rankings.map((ranking, index) => (
														<div
															key={ranking.id}
															className="grid grid-cols-[24px_1fr_auto] items-center gap-2 rounded-sm border border-stone-800 bg-stone-900/75 px-2 py-2"
														>
															{index < 3 ? (
																<Image
																	src={`/level/ranking_${index + 1}.png`}
																	alt={`${index + 1}등`}
																	width={20}
																	height={20}
																	className="size-5 object-contain"
																/>
															) : (
																<p className="text-center text-xs font-black text-amber-300">
																	{index + 1}
																</p>
															)}
															<div className="flex min-w-0 items-center gap-2">
																{ranking.profile_image ? (
																	<Image
																		unoptimized
																		width={28}
																		height={28}
																		src={ranking.profile_image}
																		alt=""
																		className="size-7 rounded-full bg-stone-800 object-cover"
																	/>
																) : (
																	<div className="size-7 rounded-full bg-stone-800" />
																)}
																<p className="min-w-0 truncate text-xs font-bold text-stone-100">
																	{ranking.nickname}
																</p>
															</div>
															<p className="text-sm font-black text-emerald-300">
																{ranking.score}점
															</p>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							)}
							{status === "ready" && isLoginNoticeOpen && (
								<div className="absolute inset-0 z-50 flex items-center justify-center rounded-sm bg-black/50 px-4">
									<div className="slab-puzzle-ready-text w-full max-w-xs rounded-sm border border-indigo-300/70 bg-stone-950/95 p-5 text-center text-stone-100 shadow-[0_0_34px_rgba(129,140,248,0.32)]">
										<Image
											src="/white-wolf.png"
											alt=""
											width={48}
											height={48}
											className="mx-auto"
										/>
										<p className="text-lg font-black">랭킹 등록 안내</p>
										<p className="mt-2 text-xs leading-relaxed text-stone-300">
											로그인 없이도 플레이할 수 있지만, 클리어 기록을 랭킹에
											남기려면 Discord 로그인이 필요합니다.
										</p>
										<Button
											type="button"
											className="mt-2 w-full border-amber-400 bg-amber-400 text-black hover:bg-amber-300 dark:text-white"
											onClick={beginGame}
										>
											로그인 없이 시작
										</Button>
										<Button
											type="button"
											className="mt-2 w-full border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
											onClick={() => setIsLoginNoticeOpen(false)}
										>
											닫기
										</Button>
									</div>
								</div>
							)}
							{status === "ready" && isHowToPlayOpen && (
								<div className="absolute inset-0 z-50 flex items-center justify-center rounded-sm bg-black/45 px-4">
									<div className="slab-puzzle-ready-text w-full max-w-sm rounded-sm border border-amber-300/70 bg-stone-950/90 p-4 text-stone-100 shadow-[0_0_32px_rgba(251,191,36,0.28)]">
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
													How to Play
												</p>
												<h2 className="mt-1 text-xl font-black">
													인벤토리 퍼즐
												</h2>
											</div>
											<button
												type="button"
												className="flex size-8 items-center justify-center rounded-sm border border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
												onClick={() => setIsHowToPlayOpen(false)}
												aria-label="닫기"
											>
												<X className="size-4" />
											</button>
										</div>
										<div className="mt-4 space-y-3 text-xs leading-relaxed text-stone-300">
											<p>
												석판을 옮겨 각 아티팩트의 표시된 최종 레벨까지 올리면
												클리어됩니다.
											</p>
											<p>회전 가능한 석판은 회전 버튼으로 돌릴 수 있습니다.</p>
											<p>
												스테이지당 제한 시간은 3분입니다.
												<br />
												빨리 클리어하고 이동 횟수를 줄일수록 점수가 높아집니다.
											</p>
										</div>
										<Button
											type="button"
											className="mt-4 w-full border-amber-400 bg-amber-400 font-black text-black hover:bg-amber-300 dark:text-white"
											onClick={() => setIsHowToPlayOpen(false)}
										>
											확인
										</Button>
									</div>
								</div>
							)}
							{status === "countdown" && (
								<div className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-sm">
									<p className="slab-puzzle-ready-text text-base font-bold tracking-[0.35em] text-amber-200 drop-shadow">
										READY
									</p>
									<p
										key={countdown}
										className="slab-puzzle-countdown-number mt-3 text-7xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
									>
										{countdown}
									</p>
								</div>
							)}
							{status === "failed" && (
								<div className="absolute inset-0 z-40 flex items-center justify-center rounded-sm bg-black/35 px-4">
									<div className="slab-puzzle-game-over-panel w-full max-w-xs rounded-sm border border-red-400/60 bg-stone-950/90 p-5 text-center shadow-[0_0_36px_rgba(248,113,113,0.35)]">
										<p className="slab-puzzle-game-over-title text-3xl font-black text-red-300">
											GAME OVER
										</p>
										<p className="mt-3 text-xs text-stone-300">
											시간이 초과되었습니다.
											<br />
											처음 화면으로 돌아갑니다.
										</p>
										<Button
											className="mt-4 w-full border-amber-500 bg-amber-500 text-black hover:bg-amber-400 dark:text-white"
											onClick={resetToReady}
										>
											메인화면으로
										</Button>
									</div>
								</div>
							)}
							{(status === "clear" || status === "done") && (
								<div className="absolute inset-0 z-40 flex items-center justify-center rounded-sm bg-black/35 px-4">
									<div className="slab-puzzle-clear-panel w-full max-w-xs rounded-sm border border-emerald-300/60 bg-stone-950/90 p-5 text-center shadow-[0_0_36px_rgba(110,231,183,0.28)]">
										<CheckCircle2 className="mx-auto size-9 text-emerald-300" />
										<p className="mt-2 text-2xl font-black text-emerald-200">
											{status === "done" ? "ALL CLEAR" : "STAGE CLEAR"}
										</p>
										<p className="mt-3 text-xs text-stone-300">
											획득 점수 {stageScore}점
										</p>
										<p className="mt-1 text-xs text-amber-300">
											총점 {totalScore}점
										</p>
										{status === "clear" ? (
											<p className="mt-3 text-xs text-stone-400">
												다음 스테이지로 이동합니다.
											</p>
										) : (
											<Button
												className="mt-4 w-full border-amber-500 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-80 dark:text-white"
												disabled={rankingSubmitState === "saving"}
												onClick={resetToReady}
											>
												{rankingSubmitState === "saving"
													? "랭킹등록중..."
													: "메인화면으로"}
											</Button>
										)}
									</div>
								</div>
							)}
							{status === "done" && (
								<div className="absolute bottom-3 left-3 right-3 z-50 rounded-sm border border-stone-700 bg-stone-950/90 p-2 text-center text-xs text-stone-300 shadow-lg">
									{rankingSubmitState === "saving" && (
										<p className="flex items-center justify-center">
											<Loader2 className="mr-2 size-3 animate-spin" />
											랭킹 저장 중
										</p>
									)}
									{rankingSubmitState === "saved" && (
										<p className="text-emerald-300">
											랭킹에 기록이 등록되었습니다.
										</p>
									)}
									{rankingSubmitState === "not-better" && (
										<p className="text-amber-300">
											기존 최고 기록이 더 높아 갱신하지 않았습니다.
										</p>
									)}
									{rankingSubmitState === "login" && (
										<p className="text-amber-300">
											비로그인이므로 랭킹에 등록되지 않습니다.
										</p>
									)}
									{rankingSubmitState === "invalid" && (
										<p className="text-red-300">
											불규칙한 점수 기록으로 랭킹에 등록되지 않습니다.
										</p>
									)}
									{rankingSubmitState === "error" && (
										<p className="text-red-300">랭킹 저장에 실패했습니다.</p>
									)}
								</div>
							)}
						</div>
						<DragOverlay dropAnimation={null}>
							{activeItem && <OverlayItem item={activeItem} />}
						</DragOverlay>
					</DndContext>

					<aside className="flex flex-col gap-3">
						<div className="rounded-sm border border-border bg-card p-3 text-card-foreground shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
							<p className="text-xs text-muted-foreground dark:text-stone-400">
								Clear condition
							</p>
							<p className="mt-1 text-base font-bold">
								{status === "failed"
									? "GAME OVER"
									: isBoardVisible
										? `미완성 아티팩트 ${incompleteArtifacts.length}개`
										: "퍼즐 대기 중"}
							</p>
							<p className="mt-2 text-xs text-foreground dark:text-stone-300">
								각 아티팩트를 최종 레벨까지 올리면 클리어!
							</p>
						</div>

						<SelectedSlabPanel slab={isBoardVisible ? selectedSlab : null} />
					</aside>
				</section>
			</div>
		</main>
	);
};

export default SlabPuzzleGame;
