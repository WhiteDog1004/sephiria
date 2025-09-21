import dayjs from "dayjs";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import { AvatarBox, Title, VersionBox } from "@/src/entities/builds";
import type { ArtifactInstance } from "@/src/entities/simulator/types";
import { ContentItem, CostumeItem } from "@/src/features/builds";
import type { BuildsOptions } from "@/src/features/builds/model/builds.types";
import {
	Box,
	Button,
	Column,
	ImageWithFallback,
	Row,
	Skeleton,
	Typography,
} from "@/src/shared";
import {
	ABILITY_STATUS_ICONS,
	ABILITY_TEXT_COLORS,
} from "./config/abilityTextOptions";

export const BuildsCard = ({
	data,
	weapon,
	miracle,
	artifact,
}: {
	data: BuildsOptions;
	weapon?: { image: string; value_kor: string };
	miracle?: { image: string; value_kor: string };
	artifact?: ArtifactInstance["item"][];
}) => {
	return (
		<Column className="w-full bg-card p-4 gap-4 justify-center items-end rounded-md border shadow-sm">
			<Row className="w-full justify-between items-center overflow-hidden gap-2">
				<AvatarBox
					img={data.writer.profileImage}
					nickname={data.writer.nickname}
				/>
				<VersionBox version={data.version} />
			</Row>
			<Column className="w-full items-center lg:flex-row gap-2">
				<CostumeItem costume={data.costume} />

				<Column className="w-full gap-2 text-center overflow-hidden">
					<Title title={data.title} />
					<Row className="w-full lg:flex-nowrap flex-wrap gap-2">
						<Row className="w-full min-w-0 lg:max-w-60 gap-2">
							{weapon ? (
								<ContentItem
									title="무기"
									img={weapon.image}
									name={weapon.value_kor}
								/>
							) : (
								<Skeleton className="w-full" />
							)}

							{miracle ? (
								<ContentItem
									title="기적"
									img={miracle.image}
									name={miracle.value_kor}
								/>
							) : (
								<Skeleton className="w-full" />
							)}
						</Row>

						<Row className="w-full gap-2">
							<ContentItem
								title={"핵심"}
								className="min-w-max"
								content={
									<Box className="items-center h-full p-0">
										{artifact?.slice(0, 2).map((item) => (
											<ImageWithFallback
												key={item.value}
												className="p-0"
												width={40}
												height={40}
												src={item.image}
												alt={item.value}
												unoptimized
											/>
										))}
									</Box>
								}
							/>
							<ContentItem
								title={"재능"}
								className="min-w-max"
								content={
									<Row className="w-full h-full justify-center items-center p-0 gap-1 md:gap-1">
										{data.ability.map((ability, index) => (
											<Column key={ability + index}>
												<Image
													width={24}
													height={24}
													className="min-w-3 max-w-3"
													src={`/stat/${ABILITY_STATUS_ICONS[index]}.png`}
													alt={"status"}
													unoptimized
												/>
												<Typography
													className={ABILITY_TEXT_COLORS[index]}
													variant="caption"
												>
													{ability}
												</Typography>
											</Column>
										))}
									</Row>
								}
							/>
						</Row>
					</Row>
				</Column>
			</Column>
			<Row className="justify-between w-full items-center">
				<Row className="items-center gap-4">
					<Row className="items-center gap-2">
						<ThumbsUp className="w-5 h-5" />
						<Typography variant="caption">{data.postLike || 0}</Typography>
					</Row>
					<Typography variant="caption" className="text-gray-500">
						{dayjs(data.created_at).format("YY.MM.DD")}
					</Typography>
				</Row>
				<Button className="max-w-24">빌드 보기</Button>
			</Row>
		</Column>
	);
};
