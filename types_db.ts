import type {
	ListType,
	TalentType,
	WriterType,
} from "./src/entities/add-build/model/createBuild.types";

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	__InternalSupabase: {
		PostgrestVersion: "12.2.3 (519615d)";
	};
	public: {
		Tables: {
			artifacts: {
				Row: {
					created_at: string;
					description: string | null;
					effect: {
						content: string;
						sets?: string[];
					};
					id: number;
					image: string;
					label_eng: string;
					label_kor: string;
					level: number | null;
					value: string;
					tier: string;
					disabled?: boolean;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					effect: {
						content: string;
						sets?: string[];
					};
					id?: number;
					image: string;
					label_eng: string;
					label_kor: string;
					level?: number | null;
					value: string;
					tier?: string;
					disabled?: boolean;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					effect: {
						content: string;
						sets?: string[];
					};
					id?: number;
					image?: string;
					label_eng?: string;
					label_kor?: string;
					level?: number | null;
					value?: string;
					tier?: string;
					disabled?: boolean;
				};
				Relationships: [];
			};
			costume: {
				Row: {
					created_at: string;
					id: number;
					image: string;
					uuid: string;
					value: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					image: string;
					uuid?: string;
					value: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					image?: string;
					uuid?: string;
					value?: string;
				};
				Relationships: [];
			};
			slabs: {
				Row: {
					created_at: string;
					id: number;
					image: string | null;
					value: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					image?: string | null;
					value: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					image?: string | null;
					value?: string;
				};
				Relationships: [];
			};
			miracle: {
				Row: {
					created_at: string;
					id: number;
					image: string | null;
					value_kor: string;
					value: string;
					uuid: string;
					effects: {
						reward?: string[];
						penalty?: string[];
					};
				};
				Relationships: [];
			};
			weapons: {
				Row: {
					created_at: string;
					id: number;
					image: string | null;
					value_kor: string;
					value: string;
					uuid: string;
					effects: {
						reward?: string[];
						penalty?: string[];
					};
					parent?: string;
					tier: number;
				};
				Relationships: [];
			};
			builds: {
				Row: {
					created_at: string;
					id: number;
					postUuid: string;
					postLike?: number;
					title: string;
					description: string;
					content: {
						label: string;
						description?: string;
						items: {
							id: number;
							img: string;
							value: string;
						}[];
					}[];
					costume: string;
					weapon: string;
					miracle: string;
					youtube_link?: string;
					version: string;
					ability: Record<string, number>;
					updated_at: string;
					writer: {
						uuid: string;
						nickname: string;
						profileImage: string;
					};
				};
				Insert: {
					created_at?: string;
					title: string;
					description: string;
					content: ListType[];
					costume: string;
					weapon: string;
					miracle: string;
					ability: TalentType;
					writer: WriterType;
					youtube_link?: string;
					version?: string;
					postLike?: number;
					postUuid: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
