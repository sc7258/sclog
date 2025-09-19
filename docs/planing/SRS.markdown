# 소프트웨어 요구사항 명세서 (SRS) - 마크다운 블로그 (Velog 클론)

## 1. 시스템 아키텍처
- **프론트엔드**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Tiptap (마크다운 에디터), react-markdown (렌더링).
- **백엔드**: Supabase (PostgreSQL, 인증, 스토리지, 실시간).
- **배포**: Vercel (서버리스 호스팅).
- **데이터 흐름**: 클라이언트 → Supabase SDK → PostgreSQL/스토리지 → Adsense 스크립트 렌더링.

## 2. 기능 요구사항
### 2.1 사용자 인증
- **API**: Supabase Auth (`auth.signUp`, `auth.signInWithOAuth`로 GitHub 연동).
- **데이터베이스 테이블**: `users` (id: uuid, email: string, profile_image: string, created_at: timestamp).
- **UI**: 로그인/회원가입 페이지, GitHub OAuth 버튼.

### 2.2 블로그 포스트 관리
- **데이터베이스 테이블**: `posts` (id: uuid, user_id: uuid, title: string, content_markdown: text, tags: string[], is_public: boolean, created_at: timestamp).
- **API**:
  - 생성: `supabase.from('posts').insert({ title, content_markdown, tags, is_public })`.
  - 조회: `supabase.from('posts').select('*').eq('is_public', true)`.
  - 수정/삭제: RLS로 포스트 소유자만 제한.
- **UI**: Tiptap 에디터로 작성, react-markdown + remark-gfm으로 렌더링.

### 2.3 댓글
- **데이터베이스 테이블**: `comments` (id: uuid, post_id: uuid, user_id: uuid, content: text, created_at: timestamp).
- **API**: `supabase.from('comments').insert({ post_id, user_id, content })`.
- **실시간**: `supabase.channel('comments')`로 댓글 변경 구독.
- **UI**: 댓글 입력란, 실시간 댓글 목록.

### 2.4 검색
- **데이터베이스**: PostgreSQL `tsvector`로 `posts.title` 및 `posts.content_markdown`에 전체 텍스트 검색.
- **API**: `supabase.from('posts').textSearch('title || content_markdown', query)`.
- **UI**: 검색바 컴포넌트 (`/search?q=[query]`).

### 2.5 Google Adsense
- **통합**: Next.js `Script` 태그로 `<ins className="adsbygoogle">` 삽입 (Layout).
- **설정**: 환경 변수로 `data-ad-client`, `data-ad-slot` 관리.
- **위치**: 포스트 하단, 사이드바 (반응형 `data-ad-format="auto"`).

## 3. 비기능 요구사항
- **성능**: 페이지 로드 2초 이내, Supabase 쿼리 500ms 이내.
- **보안**: Supabase RLS로 데이터 접근 제어, `/public/ads.txt`로 Adsense 검증.
- **확장성**: Supabase 무료 티어 (500MB DB), Vercel 무료 티어 (월 1,000명 사용자).
- **호환성**: Chrome, Firefox, Safari; 모바일 반응형 UI.

## 4. 외부 인터페이스
- **Supabase**: `@supabase/supabase-js`로 API 호출, Realtime WebSocket.
- **Adsense**: Google Adsense Management API로 광고 설정.
- **라이브러리**: Tiptap, react-markdown, remark-gfm, Tailwind CSS.