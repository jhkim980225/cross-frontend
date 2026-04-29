"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api";
import type { Platform, SortOption, Category } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants";
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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = useCallback((value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params}`);
  }, [searchParams, router]);

  // platforms 배열을 정렬해 참조값 변경에도 캐시 키 안정화
  const stablePlatforms = useMemo(() => [...platforms].sort().join(","), [platforms]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", keyword, stablePlatforms, sort, category, minPrice, maxPrice, brandId],
    queryFn: ({ pageParam = 1, signal }) =>
      searchProducts({ keyword, platforms, page: pageParam, sort, category, minPrice, maxPrice, brandId }, signal),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!keyword,
    placeholderData: keepPreviousData, // 필터 변경 시 이전 데이터 유지 (깜빡임 방지)
  });

  // sentinel 요소가 뷰포트에 들어오면 다음 페이지 로드
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const items = data?.pages.flatMap((p) => p.items ?? []) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (items.length === 0) return <EmptyState keyword={keyword} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          총 <span className="font-semibold text-gray-900 dark:text-white">{total.toLocaleString()}개</span>
        </p>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-gray-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <ProductGrid items={items} keyword={keyword} />
      <div ref={sentinelRef} />
      {isFetchingNextPage && <SkeletonGrid count={4} />}
    </div>
  );
};
