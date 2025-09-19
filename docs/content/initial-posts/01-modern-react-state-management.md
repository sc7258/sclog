---
title: "현대적인 React 상태 관리 전략"
summary: "Context, Zustand, React Query를 조합해 유지보수성과 성능을 잡는 방법을 정리했습니다."
tags: [react, state-management, frontend]
created_at: 2025-09-19
---

# 현대적인 React 상태 관리 전략

React 19 시대에는 상태를 어디에 두느냐가 앱 품질을 좌우합니다. 단순히 `useState`만으로는 복잡한 데이터를 다루기 어렵고, 그렇다고 모든 상태를 전역으로 뭉치는 것도 좋지 않습니다. 이 글에서는 **UI 지역 상태**, **전역 클라이언트 상태**, **서버 상태**를 분리해 다루는 접근법을 소개합니다.

## 1. UI 지역 상태는 최대한 근처에 둔다
- 폼의 입력값, 모달 열림 여부처럼 컴포넌트 한두 개가 쓰는 데이터는 `useState`, `useReducer`로 처리합니다.
- React Server Components와 함께 사용할 때는 클라이언트 컴포넌트를 명확히 분리해 직렬화 문제를 피하세요.

## 2. 전역 상태는 Lightweight Store로 관리
- 프로젝트 규모가 커질수록 Context만으로는 성능 이슈가 생길 수 있습니다.
- **Zustand** 혹은 **Jotai** 같은 경량 스토어를 도입해 구독 범위를 최소화하면 렌더링 낭비를 줄일 수 있습니다.
- `immer`와 조합하면 불변성 관리도 손쉽습니다.

## 3. 서버 상태는 React Query가 제일 편하다
- Supabase, REST, GraphQL 모두 React Query 한 번으로 캐시/리패치 전략을 통일할 수 있습니다.
- `prefetchQuery`를 활용하면 App Router에서 SEO와 초기 데이터 제공을 동시에 잡을 수 있습니다.

## 4. 어떤 기준으로 나눌까?
| 구분 | 도구 | 예시 |
| --- | --- | --- |
| UI 상태 | useState/useReducer | 폼 입력, 드롭다운 선택 |
| 전역 상태 | Zustand | 현재 로그인 사용자, 테마 |
| 서버 상태 | React Query | 게시글 목록, 댓글 |

## 마무리
상태 관리의 목적은 개발자를 편하게 만드는 것입니다. "어떤 데이터가 언제 어디서 쓰이는가"를 기준으로 층위를 나눠 보세요. 리팩터링 비용과 버그가 크게 줄어드는 것을 느낄 수 있습니다.
