import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
	BUILD_IMAGE_BUCKET,
	BUILD_IMAGE_MAX_WIDTH,
} from "@/src/shared/model/buildImage";

const MAX_INPUT_BYTES = 2 * 1024 * 1024;
const TARGET_OUTPUT_BYTES = 500 * 1024;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UploadedBuildImage = {
	alt: string;
	height: number;
	src: string;
	storagePath: string;
	width: number;
};

type LoadedImage = {
	dispose: () => void;
	height: number;
	source: CanvasImageSource;
	width: number;
};

const loadImage = async (file: File): Promise<LoadedImage> => {
	if (typeof window.createImageBitmap === "function") {
		try {
			const bitmap = await window.createImageBitmap(file, {
				imageOrientation: "from-image",
			});

			return {
				dispose: () => bitmap.close(),
				height: bitmap.height,
				source: bitmap,
				width: bitmap.width,
			};
		} catch {
			// Fall through to the object URL loader for older browsers.
		}
	}

	const objectUrl = URL.createObjectURL(file);

	return new Promise<LoadedImage>((resolve, reject) => {
		const image = new Image();
		image.onload = () =>
			resolve({
				dispose: () => URL.revokeObjectURL(objectUrl),
				height: image.naturalHeight,
				source: image,
				width: image.naturalWidth,
			});
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("이미지 파일을 읽을 수 없습니다."));
		};
		image.src = objectUrl;
	});
};

const canvasToWebp = (
	image: CanvasImageSource,
	width: number,
	height: number,
	quality: number,
) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const context = canvas.getContext("2d", { alpha: true });
	if (!context) throw new Error("이미지를 처리할 수 없는 브라우저입니다.");

	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = "high";
	context.drawImage(image, 0, 0, width, height);

	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error("이미지 압축에 실패했습니다."));
			},
			"image/webp",
			quality,
		);
	});
};

const compressBuildImage = async (file: File) => {
	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		throw new Error("JPG, PNG, WebP 이미지만 첨부할 수 있습니다.");
	}

	if (file.size > MAX_INPUT_BYTES) {
		throw new Error("원본 이미지는 2MB 이하여야 합니다.");
	}

	const image = await loadImage(file);

	try {
		const initialScale = Math.min(
			1,
			BUILD_IMAGE_MAX_WIDTH / Math.max(image.width, image.height),
		);
		let width = Math.max(1, Math.round(image.width * initialScale));
		let height = Math.max(1, Math.round(image.height * initialScale));
		let quality = 0.86;
		let compressed = await canvasToWebp(image.source, width, height, quality);

		for (let attempt = 0; attempt < 8; attempt += 1) {
			if (compressed.size <= TARGET_OUTPUT_BYTES) break;

			if (quality > 0.7) {
				quality -= 0.08;
			} else {
				width = Math.max(1, Math.round(width * 0.85));
				height = Math.max(1, Math.round(height * 0.85));
				quality = 0.78;
			}

			compressed = await canvasToWebp(image.source, width, height, quality);
		}

		if (compressed.size > MAX_OUTPUT_BYTES) {
			throw new Error("압축 후 이미지가 1MB를 초과합니다.");
		}

		return { blob: compressed, height, width };
	} finally {
		image.dispose();
	}
};

const getImageAlt = (fileName: string) =>
	fileName
		.replace(/\.[^.]+$/, "")
		.trim()
		.slice(0, 120) || "빌드 첨부 이미지";

export const uploadBuildImage = async ({
	file,
	postUuid,
	userId,
}: {
	file: File;
	postUuid: string;
	userId: string;
}): Promise<UploadedBuildImage> => {
	const { blob, height, width } = await compressBuildImage(file);
	const imageUuid = crypto.randomUUID();
	const storagePath = `${userId}/${postUuid}/${imageUuid}.webp`;
	const supabase = createBrowserSupabaseClient();
	const { error } = await supabase.storage
		.from(BUILD_IMAGE_BUCKET)
		.upload(storagePath, blob, {
			cacheControl: "31536000",
			contentType: "image/webp",
			upsert: false,
		});

	if (error) {
		throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
	}

	const { data } = supabase.storage
		.from(BUILD_IMAGE_BUCKET)
		.getPublicUrl(storagePath);

	return {
		alt: getImageAlt(file.name),
		height,
		src: data.publicUrl,
		storagePath,
		width,
	};
};

export const removeBuildImagesFromStorage = async (paths: string[]) => {
	if (paths.length === 0) return;

	try {
		const response = await fetch("/api/builds/images", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ paths: [...new Set(paths)] }),
			credentials: "same-origin",
			keepalive: true,
		});

		if (!response.ok) {
			console.error("Failed to remove unused build images", response.status);
		}
	} catch (error) {
		console.error("Failed to remove unused build images", error);
	}
};
