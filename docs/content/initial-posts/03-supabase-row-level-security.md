---
title: "Supabase Row Level Security 이해하기"
summary: "RLS 정책을 안전하게 작성하고 테스트하는 순서를 안내합니다."
tags: [supabase, security]
created_at: 2025-09-19
---

# Supabase Row Level Security 이해하기

Supabase는 PostgreSQL을 기반으로 하므로 Row Level Security(RLS)를 그대로 사용할 수 있습니다. RLS는 사용자가 언제 어떤 데이터를 읽고 쓸 수 있는지 결정하는 마지막 방어선입니다.

## 1. RLS 활성화
```sql
alter table posts enable row level security;
```
RLS를 켜면 기본적으로 모든 요청이 차단되므로, 적절한 정책을 반드시 추가해야 합니다.

## 2. 정책 작성 순서
1. **읽기 정책**부터 작성해 API 응답이 제대로 오는지 확인합니다.
2. 그 다음 **삽입/수정/삭제 정책**을 추가합니다.
3. 마지막으로 `with check` 절을 활용해 삽입과 업데이트 조건을 세밀하게 통제합니다.

예시:
```sql
create policy "own posts only"
on posts
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3. 테스트 방법
- Supabase SQL Editor에서 `set auth.uid = '사용자 ID';`를 지정하고 쿼리를 실행해보세요.
- Postman이나 `supabase-js`를 사용해 실제 토큰으로도 검증해야 합니다.

## 4. 감사 로깅과 모니터링
- Supabase 프로젝트 설정의 Audit Log를 활성화하면 RLS 차단 이벤트를 추적할 수 있습니다.
- 정책 변경 시에는 Git 버전 관리와 PR 리뷰를 거쳐야 실수를 줄일 수 있습니다.

## 마무리
RLS는 작성이 번거롭지만, 한번 제대로 만들어 두면 백엔드 서버를 따로 구현하지 않아도 안전한 API를 제공할 수 있습니다.
