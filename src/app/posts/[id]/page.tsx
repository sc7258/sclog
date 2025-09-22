import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/comments/CommentSection';
import Link from 'next/link';
import AdUnit from '@/components/ads/AdUnit';
import EditDeleteButtons from '@/components/posts/EditDeleteButtons';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';


// Server Component
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  if (!post.is_public && post.user_id !== user?.id) {
    notFound();
  }

  

  return (
    <div className="mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold mb-0">{post.title}</h1>
        {user && <EditDeleteButtons post={post} user={user} />}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        {post.series_name && (
          <>
            <span>&middot;</span>
            <Link
              href={`/?series=${encodeURIComponent(post.series_name)}`}
              className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
            >
              {post.series_name}
            </Link>
          </>
        )}
        {post.tags && post.tags.length > 0 && (
          <>
            <span>&middot;</span>
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <article className="mt-8">
        <div className="prose dark:prose-invert">
          <MarkdownRenderer content={post.content_markdown ?? ''} />
        </div>
      </article>

      <AdUnit
        className="my-8 text-center"
        adClientId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        adSlotId={process.env.NEXT_PUBLIC_GOOGLE_ADS_POST_SLOT_ID}
        adFormat="auto"
        isResponsive
      />

      <hr className="my-8" />

      <CommentSection postId={post.id} />
    </div>
  );
}
