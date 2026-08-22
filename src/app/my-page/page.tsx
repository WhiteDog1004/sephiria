import type { Metadata } from "next";
import { MyPageClientPage } from "@/src/modules/my-page";
import { SITE_METADATA } from "@/src/shared";

export const metadata: Metadata = SITE_METADATA.myPage;

const MyPage = () => {
	return <MyPageClientPage />;
};

export default MyPage;
