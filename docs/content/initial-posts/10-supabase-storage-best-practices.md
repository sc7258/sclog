---
title: "Supabase Storage 베스트 프랙티스"
summary: "폴더 구조 설계부터 서명 URL, 캐싱 전략까지 실무 노하우를 공유합니다."
tags: [supabase, storage]
created_at: 2025-09-19
---

# Supabase Storage 베스트 프랙티스

Supabase Storage는 S3 호환 API를 제공해 파일 관리가 매우 편리하지만, 몇 가지 원칙을 지키면 더 안정적으로 운용할 수 있습니다.

## 1. 버킷과 폴더 구조 설계
- 공개 파일과 비공개 파일을 다른 버킷으로 분리하세요. 예) `public`, `protected`, `avatars`
- 파일 이름은 `userId/timestamp-originalName` 형태로 지정하면 충돌을 줄일 수 있습니다.

## 2. 서명 URL(Signing URL) 활용
- 민감한 파일은 Public 권한을 주지 말고, 만료 시간이 짧은 서명 URL을 발급해서 전달합니다.
- `createSignedUrl(path, { expiresIn: 60 })`처럼 1~5분 내외로 만료시키면 보안성이 높아집니다.

## 3. 캐싱과 CDN
- Vercel + Cloudflare와 연동하면 전 세계 어디서나 빠르게 파일을 전송할 수 있습니다.
- 정적 자산은 Cache-Control 헤더를 길게, 하지만 자주 바뀌는 파일은 짧게 설정하세요.

## 4. 자동화 아이디어
- Edge Function을 이용해 업로드 시 썸네일을 자동 생성합니다.
- 백업 스크립트를 작성해 주기적으로 다른 스토리지에 복제하세요.

## 마무리
스토리지 전략은 앱 규모가 커질수록 중요해집니다. 설계, 보안, 자동화를 미리 고려해 두면 장애와 비용을 크게 줄일 수 있습니다.
