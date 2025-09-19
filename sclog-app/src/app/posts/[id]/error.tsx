'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('게시글 페이지에서 에러가 발생했습니다:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="text-lg font-semibold">게시글을 불러오지 못했습니다.</h2>
      <p className="mt-2 text-sm">
        네트워크 상태를 확인한 뒤 다시 시도하거나, 잠시 후에 다시 방문해 주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        다시 시도하기
      </button>
    </div>
  );
}
