"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient as createClientSupabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type EditDeleteButtonsProps = {
  post: {
    id: string;
    user_id: string;
  };
  user: User | null;
};

export default function EditDeleteButtons({ post, user }: EditDeleteButtonsProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  if (!user || user.id !== post.user_id) {
    return null;
  }

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      return;
    }

    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      console.error("Error deleting post:", error);
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }

    alert("게시물이 삭제되었습니다.");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={`/posts/${post.id}/edit`}
        className="rounded-md px-3 py-1 text-sm border border-gray-300 hover:bg-gray-50"
      >
        수정
      </Link>
      <button
        onClick={handleDelete}
        className="rounded-md px-3 py-1 text-sm border border-red-500 text-red-500 hover:bg-red-50"
      >
        삭제
      </button>
    </div>
  );
}
