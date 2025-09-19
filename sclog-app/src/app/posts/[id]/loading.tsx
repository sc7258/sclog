export default function LoadingPost() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="h-10 w-2/3 animate-pulse rounded-md bg-gray-200" />
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-4 w-24 animate-pulse rounded-md bg-gray-100" />
        <div className="h-4 w-16 animate-pulse rounded-md bg-gray-100" />
        <div className="h-4 w-20 animate-pulse rounded-md bg-gray-100" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-4 w-full animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
