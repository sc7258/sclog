import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type SearchParams = {
  q?: string;
};

type SearchPageProps = {
  searchParams?: SearchParams | Promise<SearchParams | undefined>;
};

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient();
  const resolvedSearchParams = ((await searchParams) ?? {}) as SearchParams;

  const query = resolvedSearchParams.q;

  let posts: any[] = [];
  let error: string | null = null;

  if (query) {
    const { data, error: supabaseError } = await supabase
      .from('posts')
      .select('id, title, content_markdown, created_at')
      .textSearch('title_content', query)
      .eq('is_public', true);

    if (supabaseError) {
      console.error('Error searching posts:', supabaseError);
      error = '검색 중 오류가 발생했습니다.';
    } else {
      posts = data || [];
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">'{query}' 검색 결과</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!query && <p>검색어를 입력해주세요.</p>}
      {query && posts.length === 0 && !error && <p>검색 결과가 없습니다.</p>}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-md border p-4">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{post.content_markdown}</p>
            <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
