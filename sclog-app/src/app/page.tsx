import SeriesFilter from '@/components/SeriesFilter';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type HomeSearchParams = {
  series?: string | string[];
};

type HomeProps = {
  searchParams?: HomeSearchParams | Promise<HomeSearchParams | undefined>;
};

export default async function Home({ searchParams }: HomeProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = ((await searchParams) ?? {}) as HomeSearchParams;

  const rawSeriesParam = Array.isArray(resolvedSearchParams.series)
    ? resolvedSearchParams.series[0]
    : resolvedSearchParams.series;
  const trimmedSeriesParam = rawSeriesParam?.trim();

  const { data: seriesRows, error: seriesError } = await supabase
    .from('posts')
    .select('series_name')
    .not('series_name', 'is', null);

  if (seriesError) {
    console.error('Error fetching series list:', seriesError);
  }

  const seriesList =
    seriesRows?.reduce<string[]>((acc, row) => {
      if (!row.series_name) {
        return acc;
      }
      if (!acc.includes(row.series_name)) {
        acc.push(row.series_name);
      }
      return acc;
    }, []) ?? [];

  const candidateSeries =
    trimmedSeriesParam && trimmedSeriesParam.length > 0 ? trimmedSeriesParam : undefined;

  const selectedSeries =
    candidateSeries && candidateSeries !== 'all' && !seriesList.includes(candidateSeries)
      ? 'all'
      : candidateSeries ?? 'all';

  let postsQuery = supabase
    .from('posts')
    .select('*')
    .eq('is_public', true);

  if (selectedSeries !== 'all') {
    postsQuery = postsQuery.eq('series_name', selectedSeries);
  }

  postsQuery = postsQuery.order('created_at', { ascending: false });

  const { data: posts, error: postsError } = await postsQuery;

  if (postsError) {
    console.error('Error fetching posts:', postsError);
  }

  const hasActiveSeriesFilter = selectedSeries !== 'all';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {hasActiveSeriesFilter ? `${selectedSeries} 시리즈` : '게시물 목록'}
          </h1>
          {hasActiveSeriesFilter && (
            <p className="text-sm text-gray-500">선택한 시리즈에 포함된 게시물만 표시 중입니다.</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SeriesFilter
            seriesList={seriesList}
            selectedSeries={hasActiveSeriesFilter ? selectedSeries : 'all'}
          />
          {user ? (
            <Link href="/write" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
              글쓰기
            </Link>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block rounded-lg border p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.series_name && (
                  <span className="text-xs font-medium text-indigo-600">{post.series_name}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            {hasActiveSeriesFilter ? '선택한 시리즈에 게시물이 없습니다.' : '아직 게시물이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}
