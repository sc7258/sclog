--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email); -- Initially set username to email, user can change it later
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    content_markdown text,
    tags text[],
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    series_name text
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    avatar_url text,
    updated_at timestamp with time zone
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255),
    profile_image text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Public user profile information';


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, post_id, user_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, user_id, title, content_markdown, tags, is_public, created_at, series_name) FROM stdin;
af53c678-0a34-480e-997b-376f9ad4ca18	4b2477cb-712f-47ee-9191-fee2f27e0018	현대적인 React 상태 관리 전략	<pre><code class="language-markdown"># 현대적인 React 상태 관리 전략\n\nReact 19 시대에는 상태를 어디에 두느냐가 앱 품질을 좌우합니다. 단순히 `useState`만으로는 복잡한 데이터를 다루기 어렵고, 그렇다고 모든 상태를 전역으로 뭉치는 것도 좋지 않습니다. 이 글에서는 **UI 지역 상태**, **전역 클라이언트 상태**, **서버 상태**를 분리해 다루는 접근법을 소개합니다.\n\n## 1. UI 지역 상태는 최대한 근처에 둔다\n- 폼의 입력값, 모달 열림 여부처럼 컴포넌트 한두 개가 쓰는 데이터는 `useState`, `useReducer`로 처리합니다.\n- React Server Components와 함께 사용할 때는 클라이언트 컴포넌트를 명확히 분리해 직렬화 문제를 피하세요.\n\n## 2. 전역 상태는 Lightweight Store로 관리\n- 프로젝트 규모가 커질수록 Context만으로는 성능 이슈가 생길 수 있습니다.\n- **Zustand** 혹은 **Jotai** 같은 경량 스토어를 도입해 구독 범위를 최소화하면 렌더링 낭비를 줄일 수 있습니다.\n- `immer`와 조합하면 불변성 관리도 손쉽습니다.\n\n## 3. 서버 상태는 React Query가 제일 편하다\n- Supabase, REST, GraphQL 모두 React Query 한 번으로 캐시/리패치 전략을 통일할 수 있습니다.\n- `prefetchQuery`를 활용하면 App Router에서 SEO와 초기 데이터 제공을 동시에 잡을 수 있습니다.\n\n## 4. 어떤 기준으로 나눌까?\n| 구분 | 도구 | 예시 |\n| --- | --- | --- |\n| UI 상태 | useState/useReducer | 폼 입력, 드롭다운 선택 |\n| 전역 상태 | Zustand | 현재 로그인 사용자, 테마 |\n| 서버 상태 | React Query | 게시글 목록, 댓글 |\n\n## 마무리\n상태 관리의 목적은 개발자를 편하게 만드는 것입니다. "어떤 데이터가 언제 어디서 쓰이는가"를 기준으로 층위를 나눠 보세요. 리팩터링 비용과 버그가 크게 줄어드는 것을 느낄 수 있습니다.</code></pre><p></p>	{}	t	2025-09-19 02:36:57.061045+00	\N
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, avatar_url, updated_at) FROM stdin;
4b2477cb-712f-47ee-9191-fee2f27e0018	sclog.kr@gmail.com	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, profile_image) FROM stdin;
\.


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: posts Allow authenticated users to insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to insert" ON public.posts FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: posts Allow individual delete access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual delete access" ON public.posts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: users Allow individual read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING ((auth.uid() = id));


--
-- Name: posts Allow individual read access for own drafts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual read access for own drafts" ON public.posts FOR SELECT USING (((auth.uid() = user_id) AND (is_public = false)));


--
-- Name: posts Allow individual update access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual update access" ON public.posts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: users Allow individual update access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING ((auth.uid() = id));


--
-- Name: posts Allow public read access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING ((is_public = true));


--
-- Name: comments Comments are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);


--
-- Name: posts Public posts are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public posts are viewable by everyone." ON public.posts FOR SELECT USING ((is_public = true));


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: comments Users can delete their own comments.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own comments." ON public.comments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: posts Users can delete their own posts.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own posts." ON public.posts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: comments Users can insert comments.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert comments." ON public.comments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: posts Users can insert their own posts.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own posts." ON public.posts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: comments Users can update their own comments.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own comments." ON public.comments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: posts Users can update their own posts.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own posts." ON public.posts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: comments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

--
-- Name: posts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comments TO anon;
GRANT ALL ON TABLE public.comments TO authenticated;
GRANT ALL ON TABLE public.comments TO service_role;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.posts TO anon;
GRANT ALL ON TABLE public.posts TO authenticated;
GRANT ALL ON TABLE public.posts TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

