import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/src/entities/admin";
import { AdminImagesClientPage } from "@/src/modules/admin-images/ui/AdminImagesClientPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "이미지 관리",
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			index: false,
			follow: false,
			noimageindex: true,
		},
	},
};

const AdminImagesPage = async () => {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!(await isAdminUser(user?.id))) notFound();

	return <AdminImagesClientPage />;
};

export default AdminImagesPage;
