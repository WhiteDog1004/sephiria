import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export const discordLoginHandler = async () => {
	const supabase = await createBrowserSupabaseClient();
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "discord",
		// options: {
		// 	redirectTo: "http://localhost:3000/auth/v1/callback",
		// },
	});

	if (error) {
		console.error("Error logging in with Discord:", error.message);
	}
};

export const discordLogoutHandler = async () => {
	const supabase = await createBrowserSupabaseClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("로그아웃 오류:", error.message);
	}

	window.location.href = "/";
};
