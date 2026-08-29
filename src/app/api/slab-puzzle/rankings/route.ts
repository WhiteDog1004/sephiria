import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const RANKING_LIMIT = 20;
const STAGE_LIMIT = 3;
const MAX_STAGE_SECONDS = 180;
const MAX_TOTAL_SECONDS_LEFT = STAGE_LIMIT * MAX_STAGE_SECONDS;
const BASE_TOTAL_SCORE = Array.from(
	{ length: STAGE_LIMIT },
	(_, index) => 1000 + (index + 1) * 120,
).reduce((total, score) => total + score, 0);
const MAX_STAGE_SCORE = 1000 + STAGE_LIMIT * 120 + MAX_STAGE_SECONDS * 10;

type RankingPayload = {
	score?: unknown;
	clearedStages?: unknown;
	totalMoves?: unknown;
	totalSecondsLeft?: unknown;
	bestStageScore?: unknown;
};

const getNumber = (value: unknown) =>
	typeof value === "number" && Number.isFinite(value)
		? Math.floor(value)
		: null;

const getDiscordNickname = (metadata: Record<string, unknown>) => {
	const customClaims = metadata.custom_claims as
		| Record<string, unknown>
		| undefined;

	return (
		(typeof customClaims?.global_name === "string" &&
			customClaims.global_name) ||
		(typeof metadata.full_name === "string" && metadata.full_name) ||
		(typeof metadata.name === "string" && metadata.name) ||
		(typeof metadata.preferred_username === "string" &&
			metadata.preferred_username) ||
		"Discord User"
	);
};

const getDiscordProfileImage = (metadata: Record<string, unknown>) =>
	(typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
	(typeof metadata.picture === "string" && metadata.picture) ||
	null;

const isValidRankingScore = ({
	score,
	totalMoves,
	totalSecondsLeft,
	bestStageScore,
}: {
	score: number;
	totalMoves: number;
	totalSecondsLeft: number;
	bestStageScore: number;
}) => {
	const maxScore = BASE_TOTAL_SCORE + totalSecondsLeft * 10 - totalMoves * 5;

	return (
		score >= STAGE_LIMIT * 100 &&
		score <= maxScore &&
		totalMoves >= 0 &&
		totalSecondsLeft >= 0 &&
		totalSecondsLeft <= MAX_TOTAL_SECONDS_LEFT &&
		bestStageScore >= 0 &&
		bestStageScore <= MAX_STAGE_SCORE
	);
};

export const GET = async () => {
	try {
		const supabase = await createServerSupabaseClient();
		const { data, error } = await supabase
			.from("slab_puzzle_rankings")
			.select(
				"id,user_id,nickname,profile_image,score,cleared_stages,total_moves,total_seconds_left,best_stage_score,updated_at",
			)
			.order("score", { ascending: false })
			.order("total_seconds_left", { ascending: false })
			.order("total_moves", { ascending: true })
			.order("updated_at", { ascending: true })
			.limit(RANKING_LIMIT);

		if (error) {
			return NextResponse.json(
				{ message: error.message, rankings: [] },
				{ status: 400 },
			);
		}

		return NextResponse.json({ rankings: data ?? [] }, { status: 200 });
	} catch (error) {
		console.error("GET /api/slab-puzzle/rankings failed", error);
		return NextResponse.json(
			{ message: "Failed to fetch rankings", rankings: [] },
			{ status: 500 },
		);
	}
};

export const POST = async (request: Request) => {
	try {
		const payload = (await request.json()) as RankingPayload;
		const score = getNumber(payload.score);
		const clearedStages = getNumber(payload.clearedStages);
		const totalMoves = getNumber(payload.totalMoves);
		const totalSecondsLeft = getNumber(payload.totalSecondsLeft);
		const bestStageScore = getNumber(payload.bestStageScore);

		if (
			score === null ||
			clearedStages !== STAGE_LIMIT ||
			totalMoves === null ||
			totalSecondsLeft === null ||
			bestStageScore === null ||
			score < 0 ||
			totalMoves < 0 ||
			totalSecondsLeft < 0 ||
			totalSecondsLeft > MAX_TOTAL_SECONDS_LEFT ||
			bestStageScore < 0
		) {
			return NextResponse.json(
				{ message: "Invalid ranking payload" },
				{ status: 400 },
			);
		}

		if (
			!isValidRankingScore({
				score,
				totalMoves,
				totalSecondsLeft,
				bestStageScore,
			})
		) {
			return NextResponse.json(
				{ code: "IRREGULAR_SCORE", message: "Irregular score record" },
				{ status: 400 },
			);
		}

		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ message: authError?.message ?? "Login is required" },
				{ status: 401 },
			);
		}

		const metadata = user.user_metadata as Record<string, unknown>;
		const ranking = {
			user_id: user.id,
			nickname: getDiscordNickname(metadata),
			profile_image: getDiscordProfileImage(metadata),
			score,
			cleared_stages: clearedStages,
			total_moves: totalMoves,
			total_seconds_left: totalSecondsLeft,
			best_stage_score: bestStageScore,
		};

		const { data: currentRanking, error: currentError } = await supabase
			.from("slab_puzzle_rankings")
			.select("id,score,total_seconds_left,total_moves")
			.eq("user_id", user.id)
			.maybeSingle();

		if (currentError) {
			return NextResponse.json(
				{ message: currentError.message },
				{ status: 400 },
			);
		}

		const isBetter =
			!currentRanking ||
			score > currentRanking.score ||
			(score === currentRanking.score &&
				totalSecondsLeft > currentRanking.total_seconds_left) ||
			(score === currentRanking.score &&
				totalSecondsLeft === currentRanking.total_seconds_left &&
				totalMoves < currentRanking.total_moves);

		if (!isBetter) {
			return NextResponse.json(
				{ saved: false, ranking: currentRanking },
				{ status: 200 },
			);
		}

		const query = currentRanking
			? supabase
					.from("slab_puzzle_rankings")
					.update(ranking)
					.eq("user_id", user.id)
					.select()
					.single()
			: supabase.from("slab_puzzle_rankings").insert(ranking).select().single();

		const { data, error } = await query;

		if (error) {
			return NextResponse.json(
				{ message: error.message, code: error.code },
				{ status: 400 },
			);
		}

		return NextResponse.json({ saved: true, ranking: data }, { status: 201 });
	} catch (error) {
		console.error("POST /api/slab-puzzle/rankings failed", error);
		return NextResponse.json(
			{ message: "Failed to save ranking" },
			{ status: 500 },
		);
	}
};
