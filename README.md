<p align="center">
  <img src="./public/Sephiria_Keyart_NoTitle.png" width="760" alt="Sephiria 게임 대표 이미지" />
</p>

<h1 align="center">세피리아 위키 · Sephiria Wiki</h1>

<p align="center">
  <strong>게임 정보 탐색부터 빌드 설계와 공유까지 연결하는 커뮤니티 웹 서비스</strong>
</p>

<p align="center">
  <a href="https://sephiria.wiki">서비스 바로가기</a>
</p>

<p align="center">
  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js_15-000000?logo=nextdotjs&logoColor=white" />
  <img alt="React 19" src="https://img.shields.io/badge/React_19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" />
</p>

---

## 프로젝트 소개

**세피리아 위키**는 액션 로그라이트 게임 *Sephiria*의 아이템·캐릭터 정보를 모아 제공하고, 유저가 직접 빌드를 구성하고 공유할 수 있도록 만든 **비공식 팬사이트**입니다.

처음에는 흩어져 있는 게임 정보를 쉽게 찾는 데 집중했습니다. 이후 이용자 피드백에서 **빌드 검색 및 공유 수요**를 확인해 빌드 공유 기능을 추가했고, 인벤토리 시뮬레이터·빌드 통계·퍼즐 콘텐츠까지 확장했습니다.

| 항목 | 내용 |
| --- | --- |
| 개발 형태 | **개인 프로젝트** · 기획, 프론트엔드 개발, 배포 및 운영 |
| 운영 기간 | **2025.09 ~ 현재** |
| 주요 사용자 경험 | 게임 정보 조회 → 빌드 실험 → 빌드 공유·검색 |
| 서비스 | **[sephiria.wiki](https://sephiria.wiki)** |

### 운영 기록

| 시기 | 주요 변화 | 일간 활성 사용자(DAU) |
| --- | --- | ---: |
| 2025.09 | 서비스 오픈 | 약 **300명** |
| 2025.10 | 빌드 공유 기능 공개 | 약 **3,000명** |
| 2026.08 | 게임 정식 출시 시기 | 약 **40,000명** |

> 운영 중 기록한 시기별 대략적인 수치입니다. 각 시기의 트래픽 변화가 특정 기능 하나의 효과를 의미하지는 않습니다.

---

## 주요 기능

### 1. 인벤토리 시뮬레이터

게임의 인벤토리 메커니즘을 웹에서 실험할 수 있는 인터랙티브 시뮬레이터입니다.

- `@dnd-kit/core`를 이용해 석판과 아티팩트의 **배치, 이동, 교환, 삭제**를 지원합니다.
- 회전 가능한 석판은 **90° 단위 회전**을 적용하며, 주변 슬롯에 부여하는 효과를 다시 계산합니다.
- 인접 슬롯, 행·열, 위치 조건 등 **석판별 고유 규칙**에 따라 보정치를 합산합니다.
- 석판 배치에 따른 **아티팩트 최종 레벨과 효과 설명**을 실시간으로 반영합니다.
- 슬롯 수 조절, 아이템 검색·필터, **인벤토리 이미지 저장** 기능을 제공합니다.

### 2. 빌드 공유 및 검색

이용자가 자신의 플레이 구성을 기록하고, 다른 사람의 빌드를 검색·비교할 수 있는 사용자 생성 콘텐츠(UGC) 기능입니다.

- **Discord OAuth** 로그인과 Supabase를 활용한 빌드 **등록·조회·수정·삭제**, 좋아요 및 마이페이지
- 캐릭터, 무기, 기적, 아티팩트, 콤보, 게임 버전 등 **다중 조건 검색·필터링**
- 제목·작성자 검색, 인기순·최신순 정렬, 최근 7/30일 필터와 **페이지네이션**
- 필터와 페이지 상태를 **URL 쿼리스트링에 동기화**해 검색 결과 공유 및 새로고침 시 상태 복원
- **React Hook Form + Zod**로 빌드 입력값과 재능 포인트 검증
- **Tiptap** 기반 서식 편집, 이미지 첨부, 게임 내 프리셋 코드 저장 및 열람

### 3. 빌드 통계

공유된 빌드 데이터를 기반으로 캐릭터·무기·기적·아티팩트·재능·콤보의 **사용 빈도 및 비율**을 시각화합니다. 통계 항목을 선택하면 해당 조건의 빌드 검색으로 이어지도록 연결했습니다.

### 4. 석판 퍼즐과 게임 데이터 도감

- **석판 퍼즐:** 시뮬레이터의 석판 효과 로직을 재사용해 **3단계 제한 시간 퍼즐**과 로그인 사용자 랭킹을 구현했습니다.
- **게임 정보:** 캐릭터(코스튬), 무기, 기적, 아티팩트, 석판, 재능, 콤보 정보를 탐색할 수 있는 화면을 제공합니다.

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **UI / Styling** | Tailwind CSS 4, shadcn/ui (Radix UI), Lucide React |
| **상태·서버 데이터** | Zustand, TanStack Query v5 |
| **폼·콘텐츠 편집** | React Hook Form, Zod, Tiptap |
| **인터랙션** | dnd-kit, html-to-image |
| **Backend / Auth** | Supabase (PostgreSQL, Auth, Storage), Next.js Route Handlers |
| **배포·에셋** | Vercel, Cloudflare R2 |
| **개발 도구** | Biome |

## 프로젝트 구조

Next.js App Router를 기반으로, **Feature-Sliced Design에서 영감을 받은 역할별 폴더 구조**를 사용했습니다.

```text
src/
├── app/       # 페이지, 라우팅, Route Handlers
├── modules/   # 페이지 단위의 복합 UI와 화면 상태
├── features/  # 검색, 빌드 작성, 시뮬레이터 등 기능 로직
├── entities/  # 빌드, 아티팩트, 무기 등 도메인 데이터 및 API
└── shared/    # 공통 UI, 유틸리티, 설정, 프로바이더

lib/supabase/   # 브라우저·서버 Supabase 클라이언트
supabase/       # Supabase Edge Functions
```

---

<sub>이 프로젝트는 **TEAM HORAY의 공식 서비스가 아닌 비공식 팬사이트**입니다. 게임 및 관련 이미지·상표의 권리는 각 권리자에게 있습니다.</sub>
