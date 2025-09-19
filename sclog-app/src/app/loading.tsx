export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-indigo-200" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-gray-200 p-4"
          >
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
