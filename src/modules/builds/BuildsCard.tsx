import { ThumbsUp } from "lucide-react";
import { AvatarBox } from "@/src/entities/builds";
import { VersionBox } from "@/src/entities/builds/ui/VersionBox";
import { CharacterItem } from "@/src/features/builds/ui/CharacterItem";
import {
	Box,
	Button,
	Column,
	ImageWithFallback,
	Row,
	Separator,
	Typography,
} from "@/src/shared";

export const BuildsCard = () => {
	return (
		<Column className="w-full bg-card p-6 gap-4 justify-center items-end rounded-md border shadow-sm">
			<Row className="w-full justify-between items-center">
				<AvatarBox
					img={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${"scholar_lizard"}.png`}
					nickname={"아이디가길어슬픈학자도마뱀"}
				/>
				<VersionBox version="0.8.12" />
			</Row>
			<Row className="w-full gap-4">
				<CharacterItem costume={"scholar_lizard"} />

				<Column className="w-full gap-2 text-center overflow-hidden">
					<Typography className="truncate">
						{"학자도마뱀 벽력일섬 치명타 빌드 학자도마뱀 벽력일섬 치명타 빌드"}
					</Typography>
					<Row className="w-full gap-2">
						<Row className="w-max gap-2">
							<Column className="max-w-20 w-full items-center border rounded-md">
								<Typography className="p-2" variant="caption">
									무기
								</Typography>
								<Separator />
								<Box className="h-max p-0">
									<ImageWithFallback
										className="p-1 w-12 h-12 object-contain"
										width={32}
										height={32}
										src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/${"dry_wind"}.png`}
										alt={"dry_wind"}
										unoptimized
									/>
								</Box>
								<Typography className="w-full p-2 truncate" variant="caption">
									{"무라마사"}
								</Typography>
							</Column>
							<Column className="max-w-20 min-w-20 w-full border rounded-md">
								<Typography className="p-2" variant="caption">
									기적
								</Typography>
								<Separator />
								<Box className="w-full p-0">
									<ImageWithFallback
										className="p-1 w-12 h-12 object-contain"
										width={48}
										height={48}
										src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/miracle/${"log"}.png`}
										alt={"log"}
										unoptimized
									/>
								</Box>
								<Typography className="w-full p-2 truncate" variant="caption">
									{"로그"}
								</Typography>
							</Column>
						</Row>

						<Row className="w-full gap-2">
							<Column className="min-w-max max-w-20 w-full border rounded-md">
								<Typography className="p-2" variant="caption">
									핵심 아이템
								</Typography>
								<Separator />
								<Box className="grid grid-cols-2 justify-items-center p-0">
									{Array.from({ length: 5 })
										.slice(0, 4)
										.map((_, idx) => (
											<ImageWithFallback
												key={idx}
												className="p-0"
												width={40}
												height={40}
												src={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/artifacts/${"black_scales"}.png`}
												alt={"black_scales"}
												unoptimized
											/>
										))}
								</Box>
							</Column>
							<Column className="w-full rounded-md border">
								<Column>
									<Typography className="p-2" variant="caption">
										재능
									</Typography>
									<Separator />
								</Column>
								<Row className="w-full h-full justify-center items-center p-2 gap-2">
									<Typography className="text-red-600" variant="caption">
										20
									</Typography>
									<Typography className="text-green-600" variant="caption">
										0
									</Typography>
									<Typography className="text-pink-500" variant="caption">
										10
									</Typography>
									<Typography variant="caption">0</Typography>
									<Typography className="text-blue-600" variant="caption">
										5
									</Typography>
									<Typography className="text-green-300" variant="caption">
										5
									</Typography>
								</Row>
							</Column>
						</Row>
					</Row>
				</Column>
			</Row>
			<Box className="w-full border rounded-md p-2 overflow-hidden">
				<Typography variant="body2" className="line-clamp-2">
					{
						"해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다"
					}
				</Typography>
			</Box>
			<Row className="justify-between w-full items-center">
				<Row className="items-center gap-4">
					<Row className="items-center gap-2">
						<ThumbsUp className="w-5 h-5" />
						<Typography variant="caption">{0}</Typography>
					</Row>
					<Typography variant="caption" className="text-gray-500">
						{"25.09.15"}
					</Typography>
				</Row>
				<Button className="max-w-24">빌드 보기</Button>
			</Row>
		</Column>
	);
};
