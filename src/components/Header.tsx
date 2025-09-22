import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import LogoutButton from './auth/LogoutButton';
import SearchInput from './SearchInput';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
        <Link href="/" className="order-1 text-lg font-bold text-indigo-600">
          sclog
        </Link>

        <div className="order-3 w-full sm:order-2 sm:flex-1">
          <SearchInput className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md" />
        </div>

        {user ? (
          <div className="order-2 ml-auto flex items-center gap-2 text-sm text-gray-500 sm:order-3 sm:gap-3">
            <span className="hidden max-w-[160px] truncate sm:inline" title={user.email ?? ''}>
              {user.email}
            </span>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="order-2 ml-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:order-3"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
