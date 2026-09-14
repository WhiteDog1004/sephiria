import { withSupabase } from "npm:@supabase/server@^1";

const CLEANUP_AFTER = "48 hours";
const MAX_BATCH_SIZE = 500;

type CleanupRequest = {
	dryRun?: boolean;
};

type OrphanedBuildImage = {
	created_at: string;
	path: string;
};

export default {
	fetch: withSupabase({ auth: "secret:cleanup" }, async (request, ctx) => {
		if (request.method !== "POST") {
			return Response.json(
				{ message: "Method not allowed" },
				{ status: 405, headers: { Allow: "POST" } },
			);
		}

		let payload: CleanupRequest = {};
		try {
			payload = (await request.json()) as CleanupRequest;
		} catch {
			// An empty body is a safe dry run.
		}

		const dryRun = payload.dryRun !== false;
		const findCandidates = async () => {
			const { data, error } = await ctx.supabaseAdmin.rpc(
				"find_orphaned_build_images",
				{
					p_limit: MAX_BATCH_SIZE,
					p_older_than: CLEANUP_AFTER,
				},
			);

			if (error) throw error;
			return (data ?? []) as OrphanedBuildImage[];
		};

		try {
			const candidates = await findCandidates();
			const candidatePaths = candidates.map(({ path }) => path);

			if (dryRun || candidatePaths.length === 0) {
				console.log(
					JSON.stringify({
						event: "build-image-cleanup",
						dryRun,
						candidateCount: candidatePaths.length,
						paths: candidatePaths,
					}),
				);

				return Response.json({
					dryRun,
					candidateCount: candidatePaths.length,
					removedCount: 0,
					paths: candidatePaths,
				});
			}

			// Re-query immediately before deletion so an image saved since the first
			// query is excluded from this run.
			const recheckedCandidates = await findCandidates();
			const recheckedPathSet = new Set(
				recheckedCandidates.map(({ path }) => path),
			);
			const pathsToRemove = candidatePaths.filter((path) =>
				recheckedPathSet.has(path),
			);
			if (pathsToRemove.length === 0) {
				return Response.json({
					dryRun: false,
					candidateCount: candidatePaths.length,
					removedCount: 0,
				});
			}

			const { data: removedObjects, error: removeError } =
				await ctx.supabaseAdmin.storage
					.from("build-images")
					.remove(pathsToRemove);

			if (removeError) throw removeError;

			const removedCount = removedObjects?.length ?? pathsToRemove.length;
			console.log(
				JSON.stringify({
					event: "build-image-cleanup",
					dryRun: false,
					candidateCount: candidatePaths.length,
					removedCount,
				}),
			);

			return Response.json({
				dryRun: false,
				candidateCount: candidatePaths.length,
				removedCount,
			});
		} catch (error) {
			console.error("build-image-cleanup failed", error);
			return Response.json(
				{ message: "Build image cleanup failed" },
				{ status: 500 },
			);
		}
	}),
};
