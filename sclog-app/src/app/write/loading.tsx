export default function LoadingWrite() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <div className="h-12 w-3/4 animate-pulse rounded-md bg-gray-200" />
      <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-100" />
      <div className="h-10 w-full animate-pulse rounded-md bg-gray-100" />
      <div className="h-80 w-full animate-pulse rounded-md bg-gray-100" />
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded-md bg-gray-100" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-indigo-200" />
      </div>
    </div>
  );
}
