import EditPageClient from './EditPageClient';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">게시글 수정</h1>
        <p className="text-sm text-gray-500">내용을 업데이트하고 공개 여부와 시리즈 정보를 조정할 수 있습니다.</p>
      </header>
      <EditPageClient postId={id} />
    </div>
  );
}
