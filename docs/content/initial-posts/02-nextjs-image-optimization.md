---
title: "Next.js에서 이미지 최적화 완벽 가이드"
summary: "Next.js Image 컴포넌트와 App Router 기능으로 LCP를 개선하는 방법을 정리했습니다."
tags: [nextjs, image, performance]
created_at: 2025-09-19
---

# Next.js에서 이미지 최적화 완벽 가이드

이미지는 Core Web Vitals에 직접적인 영향을 주는 요소입니다. Next.js 15(App Router)를 사용한다면 내장된 이미지 최적화 기능을 적극 활용해 보세요.

## 1. Image 컴포넌트 기본기
- `import Image from 'next/image'`를 사용하면 자동으로 WebP 변환, 사이즈 조절, lazy loading이 적용됩니다.
- 레이아웃이 확정된 경우 `width`, `height`를 명시하면 CLS를 피할 수 있습니다.

## 2. 반응형 이미지는 `sizes`와 `fill`
```tsx
<Image
  src={post.thumbnail}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, 640px"
  priority
/>
```
- `priority`는 Above-the-fold에 위치한 대표 이미지에만 적용하세요.

## 3. Blur-up Placeholder
- 저해상도 프리뷰 이미지를 `blurDataURL`에 넣으면 초기 로딩 품질이 좋아집니다.
- Supabase Storage에서 이미지 업로드 시 썸네일을 함께 생성하면 효율적입니다.

## 4. Static Imports vs Remote Patterns
- 정적인 자산은 `import hero from '@/public/hero.png'`처럼 빌드 타임에 포함시키세요.
- 외부 CDN 이미지는 `next.config.js`의 `images.remotePatterns`로 허용 도메인을 등록해야 합니다.

## 5. 체크리스트
- [ ] `<Image>`만 사용할 것
- [ ] `sizes` 지정으로 불필요한 네트워크 낭비 제거
- [ ] 레이아웃 쉬프트가 생기지 않는지 Lighthouse 확인

## 마무리
이미지 최적화는 사용자의 첫인상을 결정합니다. 위 방법을 적용하고 Vercel Analytics나 WebPageTest로 LCP 변화를 확인해 보세요.
