import Link from 'next/link';

export const metadata = {
  title: '소개 | sclog',
  description: 'sclog 블로그 플랫폼에 대한 소개 페이지',
};

export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert mx-auto max-w-3xl p-4">
      <h1>sclog 소개</h1>
      <p>
        sclog는 개발자가 빠르게 지식을 기록하고 공유할 수 있도록 만든 마크다운 기반 블로그 플랫폼입니다.
        Velog의 간결함과 Supabase의 확장성을 결합하여 개인 블로그부터 기술 팀 문서화까지 활용할 수 있습니다.
      </p>
      <h2>핵심 기능</h2>
      <ul>
        <li>마크다운 미리보기와 포맷팅을 지원하는 전용 에디터</li>
        <li>Supabase Auth를 통한 GitHub 로그인과 RLS 기반 보안</li>
        <li>댓글, 시리즈, 태그, 검색 등 콘텐츠 관리 기능</li>
        <li>Google AdSense 연동을 통한 블로그 수익화</li>
      </ul>
      <h2>운영 철학</h2>
      <p>
        sclog는 <strong>간결함</strong>, <strong>확장성</strong>, <strong>투명성</strong>을 핵심 가치로 삼습니다.
        마크다운 친화적인 워크플로와 자동 배포 파이프라인을 통해 작성자는 콘텐츠에 집중할 수 있습니다.
      </p>
      <p>
        더 자세한 사용 방법은 <Link href="/guide">사용 가이드</Link> 페이지에서 확인할 수 있습니다.
      </p>
    </div>
  );
}
