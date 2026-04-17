"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api";
import type { Platform, SortOption, Category } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SkeletonGrid } from "@/components/product/SkeletonGrid";
import { EmptyState } from "@/components/product/EmptyState";
import { SearchProgressBar } from "@/components/ui/SearchProgressBar";

type Props = {
  keyword: string;
  platforms: Platform[];
  sort: SortOption;
  category: Category;
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
};

export const ProductList = ({ keyword, platforms, sort, category, minPrice, maxPrice, brandId }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", keyword, platforms, sort, category, minPrice, maxPrice, brandId],
    queryFn: ({ pageParam = 1 }) =>
      searchProducts({ keyword, platforms, page: pageParam, sort, category, minPrice, maxPrice, brandId }),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!keyword,
  });

  if (!keyword) return null;

  if (isLoading) {
    return (
      <div>
        <SearchProgressBar isLoading />
        <SkeletonGrid />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-medium mb-3">검색 중 오류가 발생했습니다</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (items.length === 0) return <EmptyState keyword={keyword} />;

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        총 <span className="font-semibold text-gray-900 dark:text-white">{total.toLocaleString()}개</span>
      </p>
      <ProductGrid items={items} />
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-6 w-full py-2.5 text-sm text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </button>
      )}
      {isFetchingNextPage && <SkeletonGrid count={4} />}
    </div>
  );
};
