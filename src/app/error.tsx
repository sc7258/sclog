'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('전역 에러가 발생했습니다:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
      <h2 className="text-lg font-semibold">문제가 발생했습니다.</h2>
      <p className="mt-2 text-sm">
        잠시 후 다시 시도해 주세요. 문제가 지속되면 관리자에게 문의해 주세요.
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
