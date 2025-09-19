'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Tiptap from '@/components/editor/Tiptap';

const DEFAULT_SERIES_OPTION = 'none';
const NEW_SERIES_OPTION = 'new';

type PostRow = {
  id: string;
  title: string;
  content_markdown: string;
  tags: string[] | null;
  is_public: boolean;
  series_name: string | null;
  user_id: string;
};

type EditPageClientProps = {
  postId: string;
};

export default function EditPageClient({ postId }: EditPageClientProps) {
  const supabase = createClient();
  const router = useRouter();

  const [post, setPost] = useState<PostRow | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>(DEFAULT_SERIES_OPTION);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: postData, error } = await supabase
        .from<PostRow>('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !postData || user?.id !== postData.user_id) {
        router.replace('/');
        return;
      }

      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content_markdown);
      setTags(postData.tags?.join(', ') ?? '');
      setIsPublic(postData.is_public);
      setSelectedSeries(postData.series_name ?? DEFAULT_SERIES_OPTION);

      const { data: seriesData, error: seriesError } = await supabase
        .from('posts')
        .select('series_name')
        .not('series_name', 'is', null);

      if (seriesError) {
        console.error('Error fetching series:', seriesError);
      } else if (seriesData) {
        const uniqueSeries = Array.from(
          new Set(seriesData.map((row) => row.series_name).filter(Boolean) as string[])
        ).sort((a, b) => a.localeCompare(b));
        setSeriesList(uniqueSeries);
      }

      setIsLoading(false);
    };

    fetchPost();
  }, [postId, supabase, router]);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content]
  );

  const handleUpdate = async () => {
    if (!post) return;

    setErrorMessage(null);
    setIsSaving(true);

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    let finalSeriesName: string | null = null;
    if (selectedSeries === NEW_SERIES_OPTION && newSeriesName.trim()) {
      finalSeriesName = newSeriesName.trim();
    } else if (selectedSeries !== DEFAULT_SERIES_OPTION) {
      finalSeriesName = selectedSeries;
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content_markdown: content,
        tags: tagsArray,
        is_public: isPublic,
        series_name: finalSeriesName,
      })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating post:', error);
      setErrorMessage('게시물을 수정하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSaving(false);
      return;
    }

    router.push(`/posts/${post.id}`);
    router.refresh();
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-2xl font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="태그를 쉼표(,)로 구분하여 입력하세요"
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="seriesSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          시리즈
        </label>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <select
            id="seriesSelect"
            value={selectedSeries}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSeries(value);
              if (value !== NEW_SERIES_OPTION) {
                setNewSeriesName('');
              }
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-56"
          >
            <option value={DEFAULT_SERIES_OPTION}>시리즈 없음</option>
            {seriesList.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
            <option value={NEW_SERIES_OPTION}>새 시리즈 추가</option>
          </select>
          {selectedSeries === NEW_SERIES_OPTION && (
            <input
              type="text"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              placeholder="새 시리즈 이름을 입력하세요"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          )}
        </div>
      </div>

      <Tiptap content={content} onChange={setContent} />

      <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            공개 발행
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!canSubmit || isSaving}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSaving ? '수정 중...' : '수정하기'}
          </button>
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </div>
  );
}
