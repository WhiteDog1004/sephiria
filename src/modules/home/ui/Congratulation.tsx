import Image from "next/image";
import { Column, Row, Typography } from "@/src/shared";

export const Congratulation = () => {
	return (
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
			</Column>
		</Row>
	);
};
