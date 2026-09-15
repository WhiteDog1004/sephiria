export const BUILD_IMAGE_BUCKET = "build-images";
export const BUILD_IMAGE_MAX_COUNT = 5;
export const BUILD_IMAGE_MAX_FILE_SIZE = 4 * 1024 * 1024;
export const BUILD_IMAGE_MIN_WIDTH = 160;
export const BUILD_IMAGE_MAX_WIDTH = 1920;

const UUID_PATTERN =
	"[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const BUILD_IMAGE_PATH_PATTERN = new RegExp(
	`^(${UUID_PATTERN})/(${UUID_PATTERN})/(${UUID_PATTERN})\\.webp$`,
	"i",
);

type BuildImagePathOptions = {
	postUuid?: string;
	userId?: string;
};

export const isBuildImageStoragePath = (
	path: string,
	options: BuildImagePathOptions = {},
) => {
	const match = BUILD_IMAGE_PATH_PATTERN.exec(path);

	if (!match) return false;
	if (options.userId && match[1] !== options.userId) return false;
	if (options.postUuid && match[2] !== options.postUuid) return false;

	return true;
};

export const isAllowedBuildImageSource = (
	source: string,
	storagePath: string,
	options: BuildImagePathOptions = {},
) => {
	if (!isBuildImageStoragePath(storagePath, options)) return false;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	if (!supabaseUrl) return false;

	try {
		const sourceUrl = new URL(source);
		const projectUrl = new URL(supabaseUrl);
		const expectedPath = `/storage/v1/object/public/${BUILD_IMAGE_BUCKET}/${storagePath}`;

		return (
			sourceUrl.origin === projectUrl.origin &&
			decodeURIComponent(sourceUrl.pathname) === expectedPath &&
			!sourceUrl.search &&
			!sourceUrl.hash
		);
	} catch {
		return false;
	}
};

export const extractBuildImageStoragePaths = (html?: string | null) => {
	if (!html) return [];

	return [...html.matchAll(/data-storage-path="([^"]+)"/g)]
		.map((match) => match[1])
		.filter((path): path is string => Boolean(path));
};
