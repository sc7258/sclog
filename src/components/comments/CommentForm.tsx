'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && content.trim()) {
      const { error } = await supabase.from('comments').insert([
        { post_id: postId, user_id: user.id, content: content.trim() },
      ]);

      if (error) {
        console.error('Error posting comment:', error);
      } else {
        setContent('');
        router.refresh();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full rounded-md border p-2"
        rows={3}
      />
      <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
        댓글 작성
      </button>
    </form>
  );
}
