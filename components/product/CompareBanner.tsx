"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCompare } from "@/lib/api";
import { PLATFORM_META } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Platform } from "@/lib/types";

type Props = {
  keyword: string;
};

export const CompareBanner = ({ keyword }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["compare", keyword],
    queryFn: () => fetchCompare(keyword),
    enabled: !!keyword,
    staleTime: 1000 * 60 * 5,
  });

  if (!keyword || isLoading || isError || !data?.groups?.length) return null;

  const platforms = data.groups[0]?.platforms ?? {};
  const entries = Object.entries(platforms) as [Platform, { min_price: number; count: number }][];
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => a[1].min_price - b[1].min_price);

  return (
    <div className="mb-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
        플랫폼별 최저가
      </p>
      <div className="flex flex-wrap gap-3">
        {sorted.map(([platform, info], idx) => {
          const meta = PLATFORM_META[platform];
          if (!meta) return null;
          const isBest = idx === 0;
          return (
            <div
              key={platform}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                isBest
                  ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: meta.bg, color: meta.text }}
              >
                {meta.label}
              </span>
              <span className={`text-sm font-bold ${isBest ? "text-gray-900 dark:text-white" : "text-gray-800 dark:text-gray-200"}`}>
                {formatPrice(info.min_price)}~
              </span>
              <span className="text-xs text-gray-400">{info.count.toLocaleString()}개</span>
              {isBest && (
                <span className="text-xs font-medium text-white bg-gray-900 dark:text-gray-900 dark:bg-white px-1.5 py-0.5 rounded">
                  최저
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
