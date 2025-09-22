'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useRef, useState } from 'react';
import CommentForm from './CommentForm';

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type Comment = CommentRow & { authorEmail: string | null };

type ProfileRow = {
  id: string;
  email: string | null;
};

const enrichComment = (row: CommentRow, profileEmails: Record<string, string | null>): Comment => ({
  id: row.id,
  post_id: row.post_id,
  user_id: row.user_id,
  content: row.content,
  created_at: row.created_at,
  authorEmail: profileEmails[row.user_id] ?? null,
});


export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const profileEmailsRef = useRef<Record<string, string | null>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndComments = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError && userError.message !== 'Auth session missing!') {
        console.error('Error fetching auth user:', userError.message ?? userError);
      }

      setCurrentUserId(user?.id ?? null);

      const { data, error } = await supabase
        .from<CommentRow>('comments')
        .select('id, post_id, user_id, content, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error.message ?? error);
        return;
      }

      const userIds = Array.from(
        new Set((data ?? []).map((row) => row.user_id).filter((id): id is string => Boolean(id))),
      );

      await ensureProfileEmails(userIds);

      const emails = profileEmailsRef.current;

      setComments((data ?? []).map((row) => enrichComment(row, emails)));
    };

    const ensureProfileEmails = async (userIds: string[]) => {
      const missingUserIds = userIds.filter((id) => !(id in profileEmailsRef.current));

      if (missingUserIds.length === 0) {
        return;
      }

      const { data: profiles, error } = await supabase
        .from<ProfileRow>('profiles')
        .select('id, email')
        .in('id', missingUserIds);

      if (error) {
        console.error('Error fetching profiles:', error.message ?? error);
        return;
      }

      const mergedProfiles = { ...profileEmailsRef.current };

      for (const profile of profiles ?? []) {
        mergedProfiles[profile.id] = profile.email ?? null;
      }

      profileEmailsRef.current = mergedProfiles;
    };

    fetchUserAndComments();

    const channel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as CommentRow | null;

            if (!row) {
              return;
            }

            await ensureProfileEmails([row.user_id]);
            const emails = profileEmailsRef.current;

            if (payload.eventType === 'INSERT') {
              setComments((prev) => [...prev, enrichComment(row, emails)]);
            } else {
              setComments((prev) =>
                prev.map((comment) => (comment.id === row.id ? enrichComment(row, emails) : comment)),
              );
            }
          } else if (payload.eventType === 'DELETE') {
            const row = payload.old as CommentRow | null;

            if (!row) {
              return;
            }

            setComments((prev) => prev.filter((comment) => comment.id !== row.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, supabase]);

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editedContent.trim()) {
      return;
    }

    const { error } = await supabase
      .from('comments')
      .update({ content: editedContent.trim() })
      .eq('id', commentId);

    if (error) {
      console.error('Error updating comment:', error.message ?? error);
      return;
    }

    setEditingCommentId(null);
    setEditedContent('');
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    const { error } = await supabase.from('comments').delete().eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error.message ?? error);
    }
  };

  const formatAuthor = (comment: Comment) => {
    if (comment.authorEmail && comment.authorEmail !== comment.user_id) {
      return comment.authorEmail;
    }

    if (comment.user_id) {
      return `�����(${comment.user_id.slice(0, 8)}��)`;
    }

    return '�͸�';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">댓글</h2>
      <CommentForm postId={postId} />
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{formatAuthor(comment)}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            {editingCommentId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full rounded-md border p-2"
                  rows={3}
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="rounded-md bg-green-600 px-3 py-1 text-white text-sm"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="rounded-md bg-gray-400 px-3 py-1 text-white text-sm"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700">{comment.content}</p>
            )}
            {currentUserId === comment.user_id && editingCommentId !== comment.id && (
              <div className="mt-2 space-x-2 text-right">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


