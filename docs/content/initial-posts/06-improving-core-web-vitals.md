---
title: "Core Web Vitals 개선 실전 가이드"
summary: "LCP, INP, CLS를 집중적으로 개선하는 전략을 정리했습니다."
tags: [performance, web-vitals]
created_at: 2025-09-19
---

# Core Web Vitals 개선 실전 가이드

Google은 Core Web Vitals 지표(LCP, INP, CLS)를 검색 순위 신호로 사용합니다. 각 지표를 개선하기 위한 구체적인 방법을 알아봅니다.

## 1. LCP(Largest Contentful Paint)
- Hero 이미지나 제목이 늦게 뜬다면 LCP가 나빠집니다.
- 서버 사이드 렌더링(SSR) + 이미지 최적화 + 폰트 프리로드 전략을 동시에 사용하세요.

## 2. INP(Interaction to Next Paint)
- 사용자 입력 후 첫 번째 UI 업데이트까지 걸리는 시간입니다.
- 번들 크기를 줄이고, 이벤트 핸들러에서 무거운 작업은 Web Worker로 분리하세요.

## 3. CLS(Cumulative Layout Shift)
- 광고, 이미지, 폰트가 늦게 로드되면 레이아웃이 밀려나면서 점수가 악화됩니다.
- 모든 요소에 고정 크기 혹은 비율(`aspect-ratio`)을 지정하고, 광고 영역에는 플레이스홀더를 둡니다.

## 4. 측정과 모니터링
- Vercel Analytics, Chrome User Experience Report, WebPageTest를 활용하세요.
- DevTools Performance 패널에서 CPU 스로틀링을 켜고 저사양 환경을 시뮬레이션하는 것도 도움이 됩니다.

## 마무리
Core Web Vitals는 사용자가 느끼는 체감 속도를 수치로 표현한 것에 가깝습니다. 빌드 자동화 과정에 Lighthouse 테스트를 포함해 꾸준히 관리하세요.
