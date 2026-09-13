import Image from "next/image";
import { Column, Row, Typography } from "@/src/shared";

const SEPHIRIA_APP_ID = 2436940;

interface SteamPlayerCountResponse {
	response?: {
		player_count?: number;
		result?: number;
	};
}

const getCurrentPlayerCount = async () => {
	try {
		const response = await fetch(
			`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${SEPHIRIA_APP_ID}`,
			{
				next: { revalidate: 60 },
				signal: AbortSignal.timeout(5000),
			},
		);

		if (!response.ok) return null;

		const data = (await response.json()) as SteamPlayerCountResponse;
		const playerCount = data.response?.player_count;

		return typeof playerCount === "number" ? playerCount : null;
	} catch {
		return null;
	}
};

export const Congratulation = async () => {
	const playerCount = await getCurrentPlayerCount();

	return (
		<>
			{playerCount !== null && (
				<Typography
					variant="caption"
					className="flex items-center gap-1.5 text-gray-400 md:hidden"
				>
					<span
						aria-hidden="true"
						className="size-1.5 rounded-full bg-emerald-500"
					/>
					Sephiria 동시 접속자 수 {playerCount.toLocaleString("ko-KR")}명
				</Typography>
			)}
			<Row className="w-full md:flex hidden max-w-lg md:max-w-3xl gap-4 overflow-hidden items-center">
				<Image
					width={320}
					height={80}
					src={"/sephiria_main.png"}
					alt={"sephiria_main"}
					className="w-full max-w-2xs max-h-32 md:max-h-[180px] rounded-lg object-cover"
					unoptimized
				/>
				<Column className="gap-2">
					<Typography className="w-full" variant="body2">
						세피리아의 정식 출시를 진심으로 축하드립니다!
					</Typography>
					<Typography variant="caption" className="text-gray-500">
						고생 많으셨을 팀 호레이 개발자분들께 감사드리며
						<br />
						게임의 번창을 위해 세피리아 위키도 열심히 운영해 나가겠습니다!
					</Typography>
					<Typography variant="caption" className="text-gray-500">
						세피리아 위키는 여러분과 함께 만들어가는 공간입니다.
					</Typography>
					<Typography variant="caption" className="text-gray-500">
						내용에 오류가 있거나 개선 건의가 있다면
						<br />
						언제든 디스코드로 편하게 DM 주세요!
					</Typography>
					{playerCount !== null && (
						<Typography
							variant="caption"
							className="flex items-center gap-1.5 text-gray-400"
						>
							<span
								aria-hidden="true"
								className="size-1.5 rounded-full bg-emerald-500"
							/>
							Sephiria 동시 접속자 수 {playerCount.toLocaleString("ko-KR")}명
						</Typography>
					)}
				</Column>
			</Row>
		</>
	);
};
