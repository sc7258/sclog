'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostEditError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('게시글 수정 페이지에서 에러가 발생했습니다:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="text-lg font-semibold">게시글을 불러오지 못했습니다.</h2>
      <p className="mt-2 text-sm">
        페이지를 새로고침하거나, 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          다시 시도하기
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-red-600 underline hover:text-red-700"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
