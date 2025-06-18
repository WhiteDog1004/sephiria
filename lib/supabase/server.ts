"use server";

import type { Database } from "@/types_db";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerSupabaseClient = async (
	cookieStore: ReturnType<typeof cookies> = cookies(),
	admin = false
) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		admin
			? process.env.NEXT_SUPABASE_SERVICE_ROLE!
			: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				async get(name: string) {
					return (await cookieStore).get(name)?.value;
				},
				async set(name: string, value: string, options: CookieOptions) {
					try {
						(await cookieStore).set({ name, value, ...options });
					} catch (error) {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
						console.log(error);
					}
				},
				async remove(name: string, options: CookieOptions) {
					try {
						(await cookieStore).set({
							name,
							value: "",
							...options,
						});
					} catch (error) {
						// The `delete` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
						console.log(error);
					}
				},
			},
		}
	);
};

export const createServerSupabaseAdminClient = async (
	cookieStore: ReturnType<typeof cookies> = cookies()
) => {
	return createServerSupabaseClient(cookieStore, true);
};
