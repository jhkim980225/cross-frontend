"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Platform, SortOption, Category } from "@/lib/types";
import { PLATFORM_META, MVP_PLATFORMS, SORT_OPTIONS, CATEGORIES } from "@/lib/constants";
import { PriceFilter } from "@/components/search/PriceFilter";
import { BrandFilter } from "@/components/search/BrandFilter";

type Props = {
  currentPlatforms: Platform[];
  currentSort: SortOption;
  currentCategory: Category;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentBrandId?: string;
};

export const SearchFilter = ({
  currentPlatforms,
  currentSort,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentBrandId,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }

      router.push(`/search?${params}`);
    },
    [router, searchParams],
  );

  const togglePlatform = (platform: Platform) => {
    const next = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform];
    updateParams({ platform: next.length > 0 ? next : undefined });
  };

  const handleSort = (sort: SortOption) => {
    updateParams({ sort });
  };

  const handleCategory = (category: Category) => {
    updateParams({ category: category === "all" ? undefined : category });
  };

  const handlePrice = (min?: number, max?: number) => {
    updateParams({
      minPrice: min !== undefined ? String(min) : undefined,
      maxPrice: max !== undefined ? String(max) : undefined,
    });
  };

  const handleBrand = (brandId?: string) => {
    updateParams({ brandId });
  };

  const handleReset = () => {
    const q = searchParams.get("q") ?? "";
    const params = new URLSearchParams({ q });
    MVP_PLATFORMS.forEach((p) => params.append("platform", p));
    router.push(`/search?${params}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">카테고리</span>
        {CATEGORIES.map((cat) => {
          const active = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <PriceFilter currentMin={currentMinPrice} currentMax={currentMaxPrice} onChange={handlePrice} />

      <BrandFilter currentBrandId={currentBrandId} onChange={handleBrand} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">플랫폼</span>
          {MVP_PLATFORMS.map((platform) => {
            const meta = PLATFORM_META[platform];
            const active = currentPlatforms.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
                }`}
              >
                {meta.label}
              </button>
            );
          })}
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          >
            초기화
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">정렬</span>
          <select
            value={currentSort}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
