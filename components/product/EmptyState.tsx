import { SearchX } from "lucide-react";

type Props = {
  keyword: string;
};

export const EmptyState = ({ keyword }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <SearchX className="w-16 h-16 mb-4" />
      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
        &ldquo;{keyword}&rdquo; 검색 결과가 없습니다
      </p>
      <p className="mt-1 text-sm">다른 검색어로 시도해 보세요</p>
    </div>
  );
};
