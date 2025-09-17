import { ThumbsUp } from "lucide-react";
import { AvatarBox, Title, VersionBox } from "@/src/entities/builds";
import { Description } from "@/src/entities/builds/ui/Description";
import { ContentItem, CostumeItem } from "@/src/features/builds";
import {
	Box,
	Button,
	Column,
	ImageWithFallback,
	Row,
	Typography,
} from "@/src/shared";

export const BuildsCard = () => {
	return (
		<Column className="w-full bg-card p-6 gap-4 justify-center items-end rounded-md border shadow-sm">
			<Row className="w-full justify-between items-center overflow-hidden gap-2">
				<AvatarBox
					img={`https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/costume/${"scholar_lizard"}.png`}
					nickname={
						"아이디가길어슬픈학자도마뱀아이디가길어슬픈학자도마뱀아이디가길어슬픈학자도마뱀아이디가길어슬픈학자도마뱀아이디가길어슬픈학자도마뱀"
					}
				/>
				<VersionBox version="0.8.12" />
			</Row>
			<Row className="w-full gap-4">
				<CostumeItem costume={"scholar_lizard"} />

				<Column className="w-full gap-2 text-center overflow-hidden">
					<Title
						title={
							"학자도마뱀 벽력일섬 치명타 빌드 학자도마뱀 벽력일섬 치명타 빌드"
						}
					/>
					<Row className="w-full gap-2">
						<Row className="w-max gap-2">
							<ContentItem
								title={"무기"}
								img={
									"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/weapons/dry_wind.png"
								}
								name={"건조 바람"}
							/>

							<ContentItem
								title={"기적"}
								img={
									"https://utrndoiwtfajgzlsmsxj.supabase.co/storage/v1/object/public/miracle/log.png"
								}
								name={"로그"}
								className="min-w-20"
							/>
						</Row>

						<Row className="w-full gap-2">
							<ContentItem
								title={"핵심 아이템"}
								content={
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
								}
								className="max-w-20 min-w-max"
							/>
							<ContentItem
								title={"재능"}
								content={
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
								}
								className="w-full"
							/>
						</Row>
					</Row>
				</Column>
			</Row>
			<Description
				description={
					"해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다 해당 빌드는 너무너무 강해서 너무너무 강합니다 아주 무섭습니다"
				}
			/>
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
