export default function AuthCodeError() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-xs text-center">
        <h1 className="text-2xl font-bold">인증 오류</h1>
        <p className="mt-2 text-sm text-gray-500">
          인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.
        </p>
        <a href="/login" className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-white">
          로그인 페이지로 돌아가기
        </a>
      </div>
    </div>
  );
}
