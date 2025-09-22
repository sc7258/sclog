import LoginButton from '@/components/auth/LoginButton';

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-xs">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="mt-2 text-sm text-gray-500">소셜 계정으로 간편하게 로그인하세요.</p>
        </div>
        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
