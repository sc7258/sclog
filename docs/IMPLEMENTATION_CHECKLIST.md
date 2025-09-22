# Sclog 구현 체크리스트

이 문서는 `docs/planing`의 PRD, SRS, Use Case를 기반으로 작성된 구현 체크리스트입니다. 완료된 항목은 `[x]`로 표시하여 진행 상황을 추적합니다.

---

## 1. 🚀 초기 설정 및 기본 아키텍처 구축

- [x] **Next.js 프로젝트 설정**
  - [x] Next.js 15 (App Router), TypeScript 기반 프로젝트 생성
  - [x] Tailwind CSS 설정 및 `globals.css` 기본 스타일링
  - [x] `eslint.config.mjs`, `tsconfig.json` 등 개발 환경 설정
- [x] **Supabase 연동**
  - [x] Supabase 프로젝트 생성 및 환경 변수 설정 (`.env.local`)
  - [x] Supabase 클라이언트 (`@supabase/supabase-js`) 설치 및 초기화
  - [x] `lib/supabase/client.ts` (클라이언트 컴포넌트용), `lib/supabase/server.ts` (서버 컴포넌트용) 설정
- [x] **기본 레이아웃 및 UI 컴포넌트**
  - [x] `app/layout.tsx`에 기본 HTML 구조 및 메타데이터 정의
  - [x] `Header` 컴포넌트 생성 (로고, 로그인/로그아웃 버튼 위치)
  - [x] `Footer` 컴포넌트 생성 (간단한 정보)
  - [x] Velog 스타일의 심플한 디자인 테마 적용 (전역 폰트, 색상 등)

## 2. 👤 사용자 인증 시스템

- [x] **인증 기능 구현**
  - [x] Supabase Auth를 이용한 GitHub OAuth 로그인/회원가입 기능 구현
  - [x] 로그인/로그아웃 버튼 컴포넌트 (`LoginButton.tsx`, `LogoutButton.tsx`) 기능 완성
  - [x] 인증 콜백 처리 (`app/auth/callback/route.ts`)
  - [x] 인증 상태에 따라 `Header` UI 동적 변경
- [x] **데이터베이스 및 보안 설정**
  - [x] `users` 테이블 생성 (id, email, profile_image 등)
  - [x] 회원가입 시 `users` 테이블에 사용자 정보 자동 저장
  - [x] Supabase RLS (Row Level Security) 설정: 사용자 본인의 정보만 수정 가능하도록 제한
- [x] **사용자 프로필 관리**
  - [x] 사용자 프로필 페이지 (`/profile/[id]`) 생성
  - [x] 닉네임, 자기소개, 프로필 이미지 업로드/수정 UI 구현
  - [x] Supabase Storage를 이용한 프로필 이미지 저장 및 관리

## 3. ✍️ 블로그 포스트 관리

- [x] **마크다운 에디터 (@uiw/react-md-editor)**
  - [x] `/write` 페이지에 마크다운 에디터 통합 (커스텀 래퍼 `MarkdownEditor.tsx`)
  - [x] 제목, 본문, 태그 입력 UI 구현
  - [x] 공개/비공개 설정 UI (체크박스 또는 토글)
  - [x] **시리즈 분류 기능** (선택 사항)
    - [x] `posts` 테이블에 `series_id` 또는 `series_name` 필드 추가
    - [x] 포스트 작성/수정 시 시리즈 선택/생성 UI 구현
    - [x] 시리즈별 포스트 목록 조회 기능 (메인 페이지 시리즈 필터 적용)
- [x] **포스트 CRUD**
  - [x] `posts` 테이블 생성 (id, user_id, title, content_markdown, tags, is_public 등)
  - [x] 포스트 작성: "게시" 버튼 클릭 시 `posts` 테이블에 데이터 저장
  - [x] 포스트 조회:
    - [x] 메인 페이지(`app/page.tsx`)에 공개 포스트 목록 표시
    - [x] 상세 페이지 (`app/posts/[id]/page.tsx`)에서 포스트 내용 렌더링
  - [x] 포스트 수정/삭제: 포스트 소유자만 수정/삭제 버튼 표시 및 기능 구현 (RLS 정책 필수)
- [x] **콘텐츠 렌더링**
  - [x] **마크다운 렌더링 방식 변경**: `src/app/posts/[id]/page.tsx`에서 `marked` 대신 `react-markdown`을 사용하여 마크다운 콘텐츠를 렌더링하도록 수정한다.
  - [x] `react-markdown`과 `remark-gfm`을 사용하여 마크다운 콘텐츠를 HTML로 렌더링
  - [x] 코드 블록, 인용구, 리스트 등 마크다운 스타일링
  - [x] TipTap HTML 콘텐츠를 저장 전 마크다운으로 정규화하는 유틸(`src/utils/markdown.ts`) 추가 및 작성/수정 페이지에 적용
  - [x] velog의 Slate ↔ Markdown 직렬화 전략을 참고해 TipTap에서도 원본 마크다운 손실 없이 읽기/쓰기 동작을 정비 (Turndown 기반 변환기 도입 및 검증)
  - [x] `vitest` 기반 마크다운/HTML 변환 유닛 테스트 작성 (`src/utils/markdown.test.ts`)

## 4. 💬 댓글 기능

- [x] **댓글 CRUD**
  - [x] `comments` 테이블 생성 (id, post_id, user_id, content 등)
  - [x] 포스트 상세 페이지에 댓글 입력 폼 (`CommentForm.tsx`) 구현
  - [x] 댓글 작성 시 `comments` 테이블에 데이터 저장
  - [x] 댓글 수정/삭제 기능 (댓글 작성자에게만 허용)
- [x] **실시간 업데이트**
  - [x] Supabase Realtime을 사용하여 새로운 댓글 실시간으로 표시
  - [x] `CommentSection.tsx` 컴포넌트에서 실시간 구독 설정

## 5. 🔍 검색 기능

- [x] **백엔드 설정**
  - [x] PostgreSQL `tsvector`를 사용하여 `posts` 테이블의 `title`과 `content_markdown`에 대한 전체 텍스트 검색 인덱스 생성 (SQL 스크립트 제공됨)
- [x] **프론트엔드 구현**
  - [x] `Header` 또는 메인 페이지에 검색창 UI 컴포넌트 추가
  - [x] 검색어 입력 시 `/search?q=[query]` 페이지로 이동하여 검색 결과 표시
  - [x] Supabase API (`textSearch`)를 호출하여 검색 결과 조회 및 렌더링

## 6. 💰 Google AdSense 연동

- [x] **AdSense 스크립트 통합**
  - [x] `ads.txt` 파일을 `public` 폴더에 추가하여 Adsense 검증
  - [x] Next.js `Script` 태그를 사용하여 `layout.tsx` 또는 특정 페이지에 AdSense 스크립트 삽입
  - [x] `data-ad-client`, `data-ad-slot` 등 광고 ID를 환경 변수로 관리
- [x] **광고 배치**
  - [x] 포스트 하단 및 사이드바에 반응형 광고 단위 (`<ins>`) 배치
  - [x] 광고 차단기(Ad Blocker) 감지 시 대체 콘텐츠 표시 (선택 사항)

## 7. 💅 비기능 요구사항 및 최종 작업

- [x] **UI/UX 개선**
  - [x] 모바일 반응형 디자인 최종 점검 및 최적화 (헤더/검색 및 작성 화면 개선)
  - [x] 모든 페이지의 로딩 상태(Skeleton UI 등) 및 오류 상태 처리
  - [x] 사용자 피드백 기반 UI/UX 개선 사항 반영 (작성/수정 페이지 알림 및 버튼 상태 추가)
  - [x] 마크다운 에디터 툴바/아이콘 도입 (주요 포맷팅, 링크, Undo/Redo 컨트롤 제공)
  - [x] 글 작성/수정 화면 취소 버튼 제공 (작성 중단 시 이전 페이지로 복귀)
- [x] **성능 최적화**
  - [x] 페이지 로드 속도 2초 이내 목표 (이미지 최적화, 코드 스플리팅 확인)
  - [x] Supabase 쿼리 응답 시간 500ms 이내 목표 (인덱싱 확인)
- [x] **배포**
  - [x] Vercel 프로젝트에 배포 및 자동 CI/CD 설정 (docs/deployment/VERCEL_SETUP.md 정리, GitHub Actions 예시 추가)
  - [x] 프로덕션 환경 변수 설정 (Vercel 환경 변수 가이드 및 .env.example 제공)
  - [x] 커스텀 도메인 연결 및 SSL 인증서 설정 (배포 가이드 내 절차 문서화)
- [x] **초기 콘텐츠 작성**
  - [x] Adsense 승인을 위한 고품질 초기 포스트 10개 이상 작성 (docs/content/initial-posts에 샘플 10편 작성)
  - [x] 블로그 소개, 사용 가이드 등 필수 페이지 작성 (/about, /guide 페이지 추가)

---

## 8. 📝 다음 작업 메모

- [x] `src/app/profile/[id]/page.tsx`의 `<img>`를 `next/image`로 교체하거나 린트 예외 여부 결정
- [x] `src/lib/supabase/server.ts`에서 사용하지 않는 `error` 변수 정리
- [ ] 새 글 작성/수정 후 Supabase `posts.content_markdown` 필드가 순수 마크다운으로 저장되는지 다시 한번 확인 (향후 QA 시 수동 검증 필요)

