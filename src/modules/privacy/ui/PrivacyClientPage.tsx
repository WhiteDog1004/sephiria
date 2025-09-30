import { Column, Separator, Typography } from "@/src/shared";

export const PrivacyClientPage = () => {
	const contentStyles = "text-secondary";
	const contentVariant = "body2";

	return (
		<Column className="w-full items-center">
			<Column className="gap-4 p-8 my-8">
				<Typography variant="header2">세피리아위키 개인정보처리방침</Typography>

				<Typography variant={contentVariant} className={"text-gray-600"}>
					세피리아위키(이하 &quot;서비스&quot;)는 이용자의 개인정보를
					중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
					<br />본 방침은 디스코드 OAuth 로그인 기능을 통해 수집되는 개인정보에
					대해 설명합니다.
				</Typography>

				<Separator />

				<Typography variant="header3">1. 수집하는 개인정보 항목</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- Discord 사용자 ID
					<br />- Discord 사용자명
					<br />- 프로필 이미지 (URL 형태)
					<br />- 이메일 주소
				</Typography>

				<Separator />

				<Typography variant="header3">
					2. 개인정보의 수집 및 이용 목적
				</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 디스코드 계정을 통한 로그인 및 식별
					<br />- 사용자 맞춤 기능 제공
					<br />- 서비스 운영 및 보안 관리
				</Typography>

				<Separator />

				<Typography variant="header3">4. 개인정보 제3자 제공</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 본 서비스는 수집된 개인정보를 외부에 제공하지 않습니다.
				</Typography>

				<Separator />

				<Typography variant="header3">5. 개인정보 처리 위탁</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 본 서비스는 Supabase(호스팅 및 인증 기능 제공)를 이용하고 있으며,
					개인정보는 해당 서비스의 보안 정책에 따라 보호됩니다.
				</Typography>

				<Separator />

				<Typography variant="header3">
					6. 이용자의 권리와 그 행사 방법
				</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할
					수 있습니다.
					<br />- Discord 로그인 계정 정보 수정은 Discord 플랫폼을 통해 직접
					변경 가능합니다.
				</Typography>

				<Separator />

				<Typography variant="header3">7. 개인정보 보호 책임자</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 이름: WolfDog (개발자)
					<br />- 문의: #whitedog (디스코드 DM)
				</Typography>

				<Separator />

				<Typography variant="header3">8. 기타</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					- 본 방침은 관련 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시
					본 페이지에 고지합니다.
				</Typography>
				<Typography variant={contentVariant} color={contentStyles}>
					최종 업데이트: 2025년 09월 30일
				</Typography>
			</Column>
		</Column>
	);
};
