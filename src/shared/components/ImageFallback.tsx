"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const ImageWithFallback = ({ src, alt, ...props }: ImageProps) => {
	const [imgSrc, setImgSrc] = useState(src);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setImgSrc(src);
		setError(false);
		setIsLoading(true);
	}, [src]);

	const handleError = () => {
		if (!error) {
			setError(true);
			if (typeof imgSrc === "string") {
				setImgSrc(imgSrc.replace(/\.png$/, ".webp"));
			}
		}
	};

	return (
		<Image
			src={imgSrc || "/"}
			alt={alt}
			onError={handleError}
			onLoad={() => setIsLoading(false)}
			className={`transition-opacity duration-300 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
			unoptimized
			{...props}
		/>
	);
};

export { ImageWithFallback };
