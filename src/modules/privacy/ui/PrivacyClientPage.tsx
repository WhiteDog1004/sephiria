import {
	Column,
	PolicyLink,
	PolicySection,
	Separator,
	Typography,
} from "@/src/shared";

export const PrivacyClientPage = () => {
	return (
		<Column className="w-full items-center">
			<Column className="my-8 max-w-3xl gap-4 p-8">
				<Typography variant="header2">세피리아위키 개인정보처리방침</Typography>

				<Typography
					variant="body2"
					className="text-gray-600 leading-relaxed dark:text-gray-400"
				>
					세피리아위키(이하 &quot;서비스&quot;)는 이용자의 개인정보를
					중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
					<br />본 방침은 디스코드 OAuth 로그인 기능을 통해 수집되는 개인정보와,
					광고 및 서비스 분석 과정에서 자동으로 수집되는 정보에 대해 설명합니다.
				</Typography>

				<PolicySection title="1. 수집하는 개인정보 항목">
					[로그인 시 수집 항목]
					<br />- Discord 사용자 ID
					<br />- Discord 사용자명
					<br />- 프로필 이미지 (URL 형태)
					<br />- 이메일 주소
					<br />
					<br />
					[서비스 이용 과정에서 자동으로 수집되는 항목]
					<br />- 접속 IP 주소, 쿠키, 광고 식별자
					<br />- 브라우저 및 기기 정보, 운영체제 정보
					<br />- 서비스 방문 일시, 페이지 조회 및 클릭 기록
				</PolicySection>

				<PolicySection title="2. 개인정보의 수집 및 이용 목적">
					- 디스코드 계정을 통한 로그인 및 식별
					<br />- 사용자 맞춤 기능 제공
					<br />- 서비스 운영 및 보안 관리
					<br />- 서비스 이용 통계 분석 및 서비스 개선
					<br />- 이용자 관심에 기반한 맞춤형 광고 게재
				</PolicySection>

				<PolicySection title="3. 개인정보의 보유 및 이용기간">
					- 로그인 계정 정보: 회원 탈퇴 또는 삭제 요청 시까지 보유하며, 요청
					접수 후 지체 없이 파기합니다.
					<br />- 이용자가 작성한 게시물(빌드 등): 게시물 삭제 시 또는 회원 탈퇴
					시까지 보유합니다.
					<br />- 자동 수집 정보: 수집 목적 달성 시 파기하며, Google
					애널리틱스를 통해 수집된 정보는 Google의 데이터 보존 설정에 따라
					보관된 후 자동 삭제됩니다.
					<br />- 관계 법령에서 일정 기간 보존을 요구하는 경우에는 해당 기간
					동안 보관합니다.
				</PolicySection>

				<PolicySection title="4. 개인정보의 제3자 제공">
					- 본 서비스는 이용자의 개인정보를 제3자에게 판매하거나 제공하지
					않습니다.
					<br />- 다만 아래 7항에 기재된 바와 같이, 광고 게재 및 서비스 분석을
					위해 Google 등 제3자 도구가 쿠키 등을 통해 정보를 수집할 수 있습니다.
					<br />- 법령에 근거하거나 수사기관의 적법한 절차에 따른 요청이 있는
					경우에는 예외로 합니다.
				</PolicySection>

				<PolicySection title="5. 개인정보 처리 위탁 및 국외 이전">
					서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
					<br />- Vercel Inc.: 서비스 호스팅 및 배포
					<br />- Supabase Inc.: 데이터베이스 운영 및 로그인(인증) 기능 제공
					<br />- Cloudflare, Inc.: 이미지 등 정적 리소스 저장 및 전송(CDN)
					<br />- Google LLC: 광고 게재(Google AdSense) 및 서비스 이용 통계
					분석(Google Analytics)
					<br />
					<br />위 수탁업체는 모두 국외에 소재하며, 서버 또한 국외(미국 등)에
					위치할 수 있습니다. 이에 따라 서비스 제공에 필요한 범위에서 아래와
					같이 개인정보가 국외로 이전되어 처리됩니다.
					<br />- 이전되는 항목: 1항에 기재된 수집 항목
					<br />- 이전 국가 및 시점: 각 수탁업체의 데이터센터 소재 국가(미국
					등), 서비스 이용 시 네트워크를 통해 수시로 이전
					<br />- 이전 목적: 위 각 위탁 업무의 수행
					<br />- 보유·이용기간: 3항에 기재된 기간
					<br />
					<br />
					위탁받은 업체는 각사의 보안 정책 및 관련 법령에 따라 개인정보를
					보호합니다.
				</PolicySection>

				<PolicySection title="6. 이용자의 권리와 그 행사 방법">
					- 이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할
					수 있습니다.
					<br />- Discord 로그인 계정 정보 수정은 Discord 플랫폼을 통해 직접
					변경 가능합니다.
					<br />- 아래 9항의 방법으로 맞춤형 광고 및 분석 목적의 정보 수집을
					거부할 수 있습니다.
				</PolicySection>

				<PolicySection title="7. 광고 및 분석 도구의 쿠키 사용">
					- 본 서비스는 Google을 포함한 제3자 광고 공급업체가 쿠키를 사용하여
					광고를 게재하도록 허용하고 있습니다.
					<br />- Google은 광고 쿠키를 사용함으로써 이용자가 본 서비스 및 다른
					웹사이트에 방문한 기록에 기반하여 광고를 게재합니다.
					<br />- 이용자는{" "}
					<PolicyLink href="https://www.google.com/settings/ads">
						Google 광고 설정
					</PolicyLink>
					에서 맞춤 광고를 거부할 수 있습니다.
					<br />- 또한{" "}
					<PolicyLink href="https://www.aboutads.info/choices/">
						www.aboutads.info/choices
					</PolicyLink>
					에서 제3자 공급업체의 맞춤 광고 쿠키 사용을 일괄 거부할 수 있습니다.
					<br />- Google의 데이터 처리에 대한 자세한 내용은{" "}
					<PolicyLink href="https://policies.google.com/technologies/partner-sites">
						Google 파트너 사이트 정책
					</PolicyLink>
					에서 확인할 수 있습니다.
				</PolicySection>

				<PolicySection title="8. 행태정보의 수집·이용 및 거부">
					- 수집하는 행태정보 항목: 서비스 방문 이력, 페이지 조회 및 클릭 기록,
					기기·브라우저 정보, 광고 식별자
					<br />- 수집 방법: 이용자가 서비스를 방문·이용할 때 Google AdSense 및
					Google Analytics 스크립트를 통해 자동으로 수집
					<br />- 수집 목적: 이용자의 관심에 기반한 맞춤형 광고 게재, 서비스
					이용 통계 분석 및 개선
					<br />- 보유·이용기간: Google의 데이터 보존 정책 및 설정에 따라 보관된
					후 파기
					<br />- 이용자 통제권 행사 방법: 아래 9항의 방법으로 언제든지 거부할
					수 있습니다.
				</PolicySection>

				<PolicySection title="9. 쿠키의 설치·운영 및 거부 방법">
					- 웹 브라우저의 설정에서 쿠키 허용 여부를 직접 선택하거나 저장된
					쿠키를 삭제할 수 있습니다.
					<br />- 맞춤형 광고 거부:{" "}
					<PolicyLink href="https://www.google.com/settings/ads">
						https://www.google.com/settings/ads
					</PolicyLink>
					<br />- Google 애널리틱스 수집 거부:{" "}
					<PolicyLink href="https://tools.google.com/dlpage/gaoptout">
						https://tools.google.com/dlpage/gaoptout
					</PolicyLink>
					<br />- 쿠키 저장을 거부할 경우 서비스 일부 기능의 이용이 제한될 수
					있습니다.
				</PolicySection>

				<PolicySection title="10. 개인정보 보호 책임자">
					- 이름: WolfDog (개발자)
					<br />- 문의: #whitedog (디스코드 DM)
				</PolicySection>

				<PolicySection title="11. 기타">
					- 본 방침은 관련 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시
					본 페이지에 고지합니다.
				</PolicySection>

				<Separator />

				<Typography
					variant="body2"
					className="text-gray-600 dark:text-gray-400"
				>
					최종 업데이트: 2026년 08월 18일
				</Typography>
			</Column>
		</Column>
	);
};
