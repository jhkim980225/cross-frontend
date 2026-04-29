"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Platform, Category } from "@/lib/types";
import { PLATFORM_META, MVP_PLATFORMS, CATEGORY_TREE, isCategoryGroup } from "@/lib/constants";
import { PriceFilter } from "@/components/search/PriceFilter";
import { BrandFilter } from "@/components/search/BrandFilter";

type Props = {
  currentPlatforms: Platform[];
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentBrandId?: string;
};

export const SearchFilter = ({
  currentPlatforms,
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

  // 서버 prop 대신 useSearchParams 직접 참조 → 클릭 즉시 active 상태 반영
  const urlCategory = (searchParams.get("category") as Category) ?? "all";
  const urlPlatforms = searchParams.getAll("platform") as Platform[];

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">카테고리</span>
        <div className="flex flex-wrap items-start gap-y-1.5">
          {CATEGORY_TREE.map((node) => {
            if (isCategoryGroup(node)) {
              const groupActive = node.children.some((c) => c.value === urlCategory);
              return (
                <div key={node.group} className="flex flex-wrap items-center gap-1.5 w-full">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    groupActive
                      ? "text-gray-900 dark:text-white font-semibold"
                      : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {node.label}
                  </span>
                  {node.children.map((child) => {
                    const active = urlCategory === child.value;
                    return (
                      <button
                        key={child.value}
                        onClick={() => handleCategory(child.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          active
                            ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                            : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              );
            }
            const active = urlCategory === node.value;
            return (
              <button
                key={node.value}
                onClick={() => handleCategory(node.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors mr-1.5 ${
                  active
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
                }`}
              >
                {node.label}
              </button>
            );
          })}
        </div>
      </div>

      <PriceFilter currentMin={currentMinPrice} currentMax={currentMaxPrice} onChange={handlePrice} />

      <BrandFilter currentBrandId={currentBrandId} onChange={handleBrand} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">플랫폼</span>
          {MVP_PLATFORMS.map((platform) => {
            const meta = PLATFORM_META[platform];
            const active = urlPlatforms.length > 0
              ? urlPlatforms.includes(platform)
              : currentPlatforms.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
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

      </div>
    </div>
  );
};
