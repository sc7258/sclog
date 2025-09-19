# Vercel 배포 가이드

이 문서는 sclog 앱을 Vercel에 배포하고 자동 CI/CD 및 환경 변수를 설정하는 방법을 정리합니다.

## 1. 준비물

- Vercel 계정 (GitHub 연동 권장)
- GitHub 저장소(현재 프로젝트)
- Supabase 프로젝트 URL/Anon Key
- Google AdSense `data-ad-client`, `data-ad-slot`
- GitHub OAuth 앱(Client ID/Secret) — Supabase Auth에서 GitHub 로그인을 사용할 경우

## 2. Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속하여 **Add New… → Project**를 클릭합니다.
2. Git Provider로 GitHub를 선택하고, 현재 저장소(`sclog`)를 임포트합니다.
3. Framework Preset은 **Next.js**가 자동으로 선택됩니다.
4. `Root Directory`는 `sclog-app`으로 지정합니다.
5. Build/Output 설정은 기본값(`npm install`, `npm run build`, `npm start`)을 그대로 사용해도 됩니다.

## 3. 환경 변수 설정

Vercel 프로젝트 설정 → **Settings → Environment Variables**에서 아래 항목을 추가합니다.

| Key | 값 예시 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project>.supabase.co` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 클라이언트용 public key |
| `NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID` | `ca-pub-xxxxxxxxxxxxxxxx` | AdSense client ID |
| `NEXT_PUBLIC_GOOGLE_ADS_POST_SLOT_ID` | `xxxxxxxxxx` | 게시글 하단 광고 slot ID |
| `GITHUB_CLIENT_ID` | GitHub OAuth 앱 Client ID | (선택) GitHub 로그인 사용 시 |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth 앱 Client Secret | (선택) GitHub 로그인 사용 시 |

> ⚠️ **주의**: Vercel에서 Environment Variable을 추가한 후에는 새 빌드가 트리거되어야 값이 반영됩니다.

## 4. 자동 배포(CI/CD)

Vercel은 기본적으로 다음 흐름으로 CI/CD를 제공합니다.

1. GitHub `main` 브랜치에 push하면 자동으로 Production 배포가 실행됩니다.
2. Pull Request마다 Preview Deploy가 생성되어 변경 사항을 확인할 수 있습니다.

추가로 GitHub Actions를 활용한 정밀한 빌드 검증이 필요하다면 아래 예시 워크플로를 `.github/workflows/ci.yml`에 추가할 수 있습니다.

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: sclog-app
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
          cache-dependency-path: sclog-app/package-lock.json
      - run: npm install
      - run: npm run build
```

위 워크플로는 빌드 통과 여부만 확인하며, 실제 배포는 Vercel이 담당합니다.

## 5. 커스텀 도메인 & SSL

1. Vercel 대시보드에서 프로젝트를 선택하고 **Settings → Domains**로 이동합니다.
2. `Add a Domain`을 클릭한 뒤 사용할 도메인을 입력합니다.
3. 도메인 DNS 관리 콘솔에서 Vercel이 제공하는 A Record / CNAME / TXT 레코드를 추가합니다.
4. DNS 전파가 완료되면 자동으로 무료 SSL 인증서가 발급됩니다.

> 커스텀 도메인 연결 후에는 `NEXT_PUBLIC_SITE_URL`과 같은 값이 필요하다면 환경 변수로 추가해 둘 수 있습니다.

## 6. 배포 후 확인 체크리스트

- Production URL 접속 → 기본 페이지 정상 렌더링 확인
- GitHub OAuth 로그인이 정상 동작하는지 확인
- 글 작성/수정/삭제 및 댓글 기능 동작 확인
- 광고 슬롯이 정상적으로 노출되는지 확인 (AdSense 승인은 시간이 걸릴 수 있음)
- `vercel logs` 또는 Vercel 대시보드에서 오류 로그 확인

---

추가적인 배포 관련 메모는 `docs/deployment` 디렉터리에 정리해두세요.
