'use client';

import MarkdownEditor from '@/components/editor/MarkdownEditor';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const DEFAULT_SERIES_OPTION = 'none';
const NEW_SERIES_OPTION = 'new';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>(DEFAULT_SERIES_OPTION);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('series_name')
        .not('series_name', 'is', null);

      if (error) {
        console.error('Error fetching series:', error);
        setErrorMessage('시리즈 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      if (data) {
        const uniqueSeries = Array.from(new Set(data.map((item) => item.series_name))).filter(Boolean) as string[];
        setSeriesList(uniqueSeries.sort((a, b) => a.localeCompare(b)));
      }
    };

    fetchSeries();
  }, [supabase]);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content],
  );

  const handleSave = async () => {
    setErrorMessage(null);
    setIsSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching auth user:', userError);
    }

    if (!user) {
      setErrorMessage('글을 작성하려면 로그인이 필요합니다.');
      setIsSaving(false);
      return;
    }

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

    const markdownContent = content.trim();

    if (!markdownContent) {
      setErrorMessage('본문을 입력해 주세요.');
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          title: title.trim(),
          content_markdown: markdownContent,
          user_id: user.id,
          tags: tagsArray,
          is_public: isPublic,
          series_name: finalSeriesName,
        },
      ]);

    if (error) {
      console.error('Error saving post:', error);
      setErrorMessage('게시물을 저장하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSaving(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">새 글 작성</h1>
        <p className="text-sm text-gray-500">제목과 내용을 입력한 뒤 공개 여부와 시리즈를 선택하세요.</p>
      </header>

      {errorMessage && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

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

        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
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
            onClick={handleSave}
            disabled={!canSubmit || isSaving}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}


