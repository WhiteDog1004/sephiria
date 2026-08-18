import { Column, PolicySection, Separator, Typography } from "@/src/shared";

export const TermsClientPage = () => {
	return (
		<Column className="w-full items-center">
			<Column className="my-8 max-w-3xl gap-4 p-8">
				<Typography variant="header2">세피리아위키 이용약관</Typography>

				<Typography
					variant="body2"
					className="text-gray-600 leading-relaxed dark:text-gray-400"
				>
					본 약관은 세피리아위키(이하 &quot;서비스&quot;)의 이용 조건과 운영
					정책을 안내합니다. 서비스를 이용하는 경우 본 약관에 동의한 것으로
					간주됩니다.
				</Typography>

				<PolicySection title="1. 서비스의 성격">
					- 본 서비스는 게임 &quot;세피리아(Sephiria)&quot;의 정보를 정리하고
					이용자 간 빌드를 공유하기 위한 비공식 팬사이트입니다.
					<br />- 게임에 관한 모든 저작권은 TEAM HORAY에 있으며, 본 서비스는
					개발사와 제휴하거나 공식적으로 후원받는 관계가 아닙니다.
					<br />- 본 서비스는 무료로 제공되며, 운영 비용 충당을 위해 광고를
					게재합니다.
				</PolicySection>

				<PolicySection title="2. 계정">
					- 서비스의 일부 기능(빌드 작성, 좋아요 등)은 Discord 계정을 통한
					로그인 후 이용할 수 있습니다.
					<br />- 이용자는 자신의 계정으로 이루어진 활동에 대해 책임을 집니다.
				</PolicySection>

				<PolicySection title="3. 이용자의 의무">
					이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다.
					<br />- 타인의 권리를 침해하거나 명예를 훼손하는 행위
					<br />- 욕설, 차별, 혐오 표현 등 타인에게 불쾌감을 주는 내용의 게시
					<br />- 음란물, 불법 정보, 광고성 게시물(스팸)의 게시
					<br />- 서비스의 정상적인 운영을 방해하는 행위(비정상적인 자동화 접근,
					과도한 요청, 취약점 악용 등)
					<br />- 타인의 계정을 도용하거나 타인을 사칭하는 행위
					<br />- 기타 관련 법령에 위반되는 행위
				</PolicySection>

				<PolicySection title="4. 게시물의 권리와 책임">
					- 이용자가 작성한 게시물의 권리는 작성자에게 있습니다.
					<br />- 서비스는 게시물을 서비스 내에서 노출·검색·공유하기 위한 범위에
					한해 사용할 수 있습니다.
					<br />- 게시물의 내용에 대한 책임은 작성자 본인에게 있으며, 서비스는
					이용자가 작성한 내용의 정확성을 보증하지 않습니다.
				</PolicySection>

				<PolicySection title="5. 게시물의 관리">
					- 3항의 금지 행위에 해당하거나 관련 법령에 위반되는 게시물은 사전 통보
					없이 삭제되거나 노출이 제한될 수 있습니다.
					<br />- 위반 정도가 중하거나 반복되는 경우 서비스 이용이 제한될 수
					있습니다.
					<br />- 삭제 또는 제한 조치에 이의가 있는 경우 아래 8항의 문의처로
					소명할 수 있습니다.
				</PolicySection>

				<PolicySection title="6. 광고 게재">
					- 본 서비스는 Google AdSense를 통해 광고를 게재하고 있습니다.
					<br />- 광고를 통해 수집되는 정보와 맞춤형 광고의 거부 방법은
					개인정보처리방침에서 안내하고 있습니다.
					<br />- 광고에 표시된 상품 또는 서비스에 관한 거래는 이용자와 해당
					광고주 사이에서 이루어지며, 본 서비스는 그 거래에 대해 책임지지
					않습니다.
				</PolicySection>

				<PolicySection title="7. 서비스의 변경·중단 및 면책">
					- 서비스의 내용은 운영상 또는 기술상의 필요에 따라 변경되거나 중단될
					수 있습니다.
					<br />- 게임 정보는 게임 업데이트 등에 따라 실제와 다를 수 있으며,
					서비스는 정보의 정확성이나 최신성을 보증하지 않습니다.
					<br />- 천재지변, 외부 서비스 장애 등 서비스가 통제할 수 없는 사유로
					발생한 손해에 대해서는 책임을 지지 않습니다.
				</PolicySection>

				<PolicySection title="8. 문의처">
					- 운영자: WolfDog (개발자)
					<br />- 문의: #whitedog (디스코드 DM)
				</PolicySection>

				<PolicySection title="9. 약관의 변경">
					- 본 약관은 관련 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시
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
