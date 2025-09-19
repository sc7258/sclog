'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface SeriesFilterProps {
  seriesList: string[];
  selectedSeries: string;
}

const SeriesFilter: React.FC<SeriesFilterProps> = ({ seriesList, selectedSeries }) => {
  const router = useRouter();
  const sortedSeries = [...seriesList].sort((a, b) => a.localeCompare(b));

  const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeries = e.target.value;
    if (newSeries === 'all') {
      router.push('/');
    } else {
      router.push(`/?series=${encodeURIComponent(newSeries)}`);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="seriesFilter" className="text-sm font-medium">
        시리즈 필터:
      </label>
      <select
        id="seriesFilter"
        value={selectedSeries}
        onChange={handleSeriesChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      >
        <option value="all">모든 시리즈</option>
        {sortedSeries.map((series) => (
          <option key={series} value={series}>
            {series}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeriesFilter;
