# Sephiria: 액션 로그라이트 인디 게임 팬사이트

[세피리아 위키](https//sephiria.wiki)

**Nextjs15와 FSD아키텍처를 기반으로 구현한 APP ROUTER 동적 사이트입니다.**

아이템(석판, 아티팩트) 간의 상호작용을 통해 실시간으로 변화하는 효과를 시뮬레이션할 수 있는 웹 사이트입니다. 최신 웹 기술 스택을 적극적으로 활용하여 인터랙션과 확장성 + 기술 스택 향상을 목표로 개발하였습니다.

---

## 🛠️ 기술 스택

| Category      | Technologies                                                                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core** | ![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan?style=for-the-badge&logo=tailwind-css)                                                                               |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-black?style=for-the-badge&logo=zustand)                                                                                                                                                                            |
| **Data** | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-orange?style=for-the-badge&logo=tanstack) ![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)                                                                      |
| **Interaction** | ![dnd-kit](https://img.shields.io/badge/@dnd--kit-gray?style=for-the-badge) ![Shadcn](https://img.shields.io/badge/Shadcn-black?style=for-the-badge&logo=shadcn) ![Lucide React](https://img.shields.io/badge/Lucide-black?style=for-the-badge&logo=lucide)             |
| **Tooling** | ![Biome JS](https://img.shields.io/badge/Biome_JS-blue?style=for-the-badge&logo=biome)                                                                            |

- 기술 스택 향상을 목표로 라이브러리들을 최신 버전들을 활용했습니다.

---

## ✨ 주요 기능

### 1. 시뮬레이터 페이지 - 드래그 앤 드롭 인터페이스
- `@dnd-kit` dnd 라이브러리를 사용하여 사용자가 아이템을 직관적으로 배치, 이동, 교환, 삭제할 수 있는 인터페이스를 구현했습니다.

### 2. 아이템 상호작용 시스템 
- **석판 (Slabs)**: 인벤토리 칸에 +n 또는 -n 효과를 부여하는 기본 아이템입니다. 회전(Rotation)이 가능하며, 회전에 따라 효과의 방향이나 부호가 동적으로 변경됩니다.
- **아티팩트 (Artifacts)**: 석판이 부여한 효과 값에 따라 레벨이 실시간으로 변화하는 특수 아이템입니다. `useMemo`를 활용하여 석판의 배치가 변경될 때마다 아티팩트의 최종 레벨과 효과 설명이 즉시 재계산됩니다.
- **조건부 효과**: "인벤토리 가장자리에 있을 때", "특정 속성('ignore')을 가진 칸 위에 있을 때" 등 다양한 조건에 따라 발동하는 복잡한 효과들을 구현했습니다.

### 3. 실시간 효과 미리보기 툴팁
- 사용자가 아이템 목록에서 해당 아이템 위로 마우스를 올리면, 해당 아이템에 대한 설명을 툴팁을 통해 시각적으로 미리 확인할 수 있습니다.

### 4. 캐릭터 & 석판 & 아티팩트 & 무기 페이지
- 전체적으로 `supabase`를 활용하여 데이터를 가져와 동적으로 보여주도록 개발했습니다. 게임의 잦은 업데이트로 인한 변경사항이 생기면 `supabase`를 통해 빠르게 수정이 가능토록 했습니다.

---

## 🏛️ 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 설계되었습니다. 이를 통해 코드의 각 부분이 명확한 책임과 역할을 가지게 되어, 복잡한 인벤토리 시스템의 유지보수성과 확장성을 크게 향상시켰습니다.

- **`app`**: 라우팅, 전역 스타일 및 프로바이더 설정
- **`entities`**: 핵심 비즈니스 개체 (예: `InventorySlot`)
- **`features`**: 사용자 상호작용 및 비즈니스 로직 (예: `드래그앤드롭 핸들러`, `효과 툴팁`)
- **`shared`**: 재사용 가능한 UI 컴포넌트 (`Box`, `Typography`), 커스텀 훅 (`useInventory`), 라이브러리 설정, 타입 등