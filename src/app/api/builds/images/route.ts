import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
	BUILD_IMAGE_BUCKET,
	isBuildImageStoragePath,
} from "@/src/shared/model/buildImage";

export const dynamic = "force-dynamic";

const MAX_CLEANUP_PATHS = 100;

export const DELETE = async (request: Request) => {
	try {
		const supabase = await createServerSupabaseClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Login is required" },
				{ status: 401 },
			);
		}

		const payload = (await request.json()) as { paths?: unknown };
		if (
			!Array.isArray(payload.paths) ||
			payload.paths.length > MAX_CLEANUP_PATHS
		) {
			return NextResponse.json(
				{ message: "Invalid image paths" },
				{ status: 400 },
			);
		}

		const paths = [
			...new Set(
				payload.paths.filter(
					(path): path is string =>
						typeof path === "string" &&
						isBuildImageStoragePath(path, { userId: user.id }),
				),
			),
		];

		if (paths.length === 0) {
			return NextResponse.json({ removed: 0 }, { status: 200 });
		}

		const { error } = await supabase.storage
			.from(BUILD_IMAGE_BUCKET)
			.remove(paths);

		if (error) {
			return NextResponse.json({ message: error.message }, { status: 400 });
		}

		return NextResponse.json({ removed: paths.length }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/builds/images failed", error);
		return NextResponse.json(
			{ message: "Failed to remove build images" },
			{ status: 500 },
		);
	}
};
