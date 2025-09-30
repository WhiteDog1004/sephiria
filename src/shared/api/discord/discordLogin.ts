import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const getServerLoginInfo = async () => {
	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		console.error("세션 정보 가져오기 오류:", error.message);
		return;
	}

	return data.session;
};

export const getLoginInfo = async () => {
	const supabase = await createBrowserSupabaseClient();
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		console.error("세션 정보 가져오기 오류:", error.message);
		return;
	}

	return data.session;
};
