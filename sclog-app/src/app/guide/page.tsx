import Link from 'next/link';

export const metadata = {
  title: '사용 가이드 | sclog',
  description: 'sclog 작성자와 독자를 위한 사용 안내 페이지',
};

export default function GuidePage() {
  return (
    <div className="prose dark:prose-invert mx-auto max-w-3xl p-4">
      <h1>sclog 사용 가이드</h1>
      <p>
        이 페이지는 sclog를 사용하는 작성자와 독자를 위한 전체 가이드입니다. 처음 방문했다면 아래 체크리스트를 순서대로 따라 해보세요.
      </p>

      <h2>1. 시작하기</h2>
      <ol>
        <li>우측 상단의 <strong>로그인</strong> 버튼으로 GitHub OAuth 인증을 진행합니다.</li>
        <li>프로필 페이지에서 닉네임, 자기소개, 프로필 이미지를 등록합니다.</li>
        <li>소개글은 <Link href="/about">소개 페이지</Link>에서 확인할 수 있습니다.</li>
      </ol>

      <h2>2. 글 작성 워크플로</h2>
      <ol>
        <li><strong>글쓰기</strong> 버튼을 눌러 `/write` 페이지로 이동합니다.</li>
        <li>제목과 본문은 필수 필드입니다. 빈 값일 경우 저장 버튼이 비활성화됩니다.</li>
        <li>Tiptap 툴바를 사용해 헤딩, 코드 블록, 리스트, 링크 등을 손쉽게 삽입하세요.</li>
        <li>시리즈를 선택하거나 새 시리즈를 추가하고, 쉼표로 태그를 입력합니다.</li>
        <li>작성 도중 중단하고 싶다면 <strong>취소</strong> 버튼으로 이전 페이지로 돌아갈 수 있습니다.</li>
      </ol>

      <h2>3. 글 관리</h2>
      <ul>
        <li>게시글 상세 페이지에서 작성자는 <strong>수정</strong> / <strong>삭제</strong> 버튼을 이용할 수 있습니다.</li>
        <li>시리즈 배지를 클릭하면 해당 시리즈만 필터링된 목록으로 이동합니다.</li>
        <li>댓글은 Supabase Realtime으로 실시간 동기화됩니다.</li>
      </ul>

      <h2>4. 배포 & 운영</h2>
      <p>
        Vercel 배포 및 환경 변수 설정, 커스텀 도메인 연결은 <a href="https://github.com/sc7258/sclog/tree/main/docs/deployment/VERCEL_SETUP.md" target="_blank" rel="noopener noreferrer">배포 가이드</a>를 참고하세요.
        운영 중에는 Lighthouse, Vercel Analytics 등을 활용해 Core Web Vitals를 주기적으로 점검하는 것을 권장합니다.
      </p>

      <h2>5. 고품질 콘텐츠 작성 팁</h2>
      <ul>
        <li><code>docs/content/initial-posts</code> 디렉터리에 예시 글 10편이 수록되어 있습니다.</li>
        <li>2000자 이상의 심층 콘텐츠와 코드 스니펫, 다이어그램 등을 활용해 독자의 시간을 절약해 주세요.</li>
        <li>저작권이 명확한 이미지나 자체 제작 이미지를 사용하세요.</li>
      </ul>

      <h2>도움이 더 필요하다면?</h2>
      <p>
        새로운 기능 제안이나 버그 신고는 GitHub Issues에서 남겨 주세요. 함께 더 나은 블로그 경험을 만들어 가요!
      </p>
    </div>
  );
}

