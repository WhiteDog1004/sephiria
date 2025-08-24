export interface MiracleOptions {
	data: {
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
	}[];
}
