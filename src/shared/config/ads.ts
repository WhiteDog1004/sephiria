export const ADSENSE_CLIENT_ID = "ca-pub-3851224465271826";

/**
 * 개발 환경이나 프리뷰 배포에서 발생한 광고 노출은 무효 트래픽으로 집계될 수 있어
 * 프로덕션 배포에서만 광고를 로드한다.
 */
export const ADS_ENABLED =
	process.env.NODE_ENV === "production" &&
	process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview";
