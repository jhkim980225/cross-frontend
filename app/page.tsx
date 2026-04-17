import { SearchBar } from "@/components/search/SearchBar";
import { RecentKeywords } from "@/components/search/RecentKeywords";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        중고마켓 통합검색
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        여러 중고 플랫폼의 상품을 한 번에 비교하세요
      </p>
      <SearchBar size="lg" />
      <RecentKeywords />
    </main>
  );
}
