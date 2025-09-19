-- comments 테이블 생성
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- comments 테이블 RLS 정책
-- 1. 모든 사용자가 댓글을 읽을 수 있도록 허용
CREATE POLICY "Enable read access for all users" ON "public"."comments"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- 2. 인증된 사용자만 댓글을 작성할 수 있도록 허용
CREATE POLICY "Enable insert for authenticated users only" ON "public"."comments"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. 자신의 댓글만 수정할 수 있도록 허용
CREATE POLICY "Enable update for users based on user_id" ON "public"."comments"
AS PERMISSIVE FOR UPDATE
TO public
USING ((auth.uid() = user_id))
WITH CHECK ((auth.uid() = user_id));

-- 4. 자신의 댓글만 삭제할 수 있도록 허용
CREATE POLICY "Enable delete for users based on user_id" ON "public"."comments"
AS PERMISSIVE FOR DELETE
TO public
USING ((auth.uid() = user_id));

-- posts 테이블에 검색을 위한 tsvector 컬럼 추가 및 인덱스 생성
ALTER TABLE posts
ADD COLUMN tsv_content TSVECTOR GENERATED ALWAYS AS (
  setweight(to_tsvector('english', title), 'A') ||
  setweight(to_tsvector('english', content_markdown), 'B')
) STORED;

CREATE INDEX tsv_content_idx ON posts USING GIN (tsv_content);

-- RLS 정책 업데이트 (선택 사항: 검색 성능 향상을 위해 필요시)
-- 기존 RLS 정책에 tsv_content 컬럼에 대한 접근 허용 추가
-- 예시: SELECT 정책에 tsv_content 포함
-- ALTER POLICY "Enable read access for all users" ON "public"."posts"
-- USING (is_public = true OR auth.uid() = user_id);