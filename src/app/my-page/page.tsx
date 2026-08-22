import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClientPage, MyPageLoading } from "@/src/modules/my-page";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = SITE_METADATA.myPage;

const MyPage = () => {
	return (
		<Suspense fallback={<MyPageLoading />}>
			<MyPageClientPage />
		</Suspense>
	);
};

export default MyPage;
