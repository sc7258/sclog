'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SearchInputProps = {
  className?: string;
};

export default function SearchInput({ className = '' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const formClassName = ['flex w-full items-center gap-2 sm:w-auto', className]
    .filter(Boolean)
    .join(' ');

  return (
    <form onSubmit={handleSearch} className={formClassName}>
      <label htmlFor="header-search" className="sr-only">
        검색어 입력
      </label>
      <input
        id="header-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        검색
      </button>
    </form>
  );
}
