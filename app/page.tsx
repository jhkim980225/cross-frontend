import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { HomeSearch } from "@/components/search/HomeSearch";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          중고마켓 통합검색
        </span>
        <HeaderAuth />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          중고마켓 통합검색
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          여러 중고 플랫폼의 상품을 한 번에 비교하세요
        </p>
        <HomeSearch />
      </main>
    </div>
  );
}
