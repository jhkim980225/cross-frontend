"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { MVP_PLATFORMS } from "@/lib/constants";

export const RecentKeywords = () => {
  const { recentKeywords, removeKeyword, clearKeywords, addKeyword } = useSearchStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || recentKeywords.length === 0) return null;

  const handleClick = (kw: string) => {
    addKeyword(kw);
    const params = new URLSearchParams({ q: kw });
    MVP_PLATFORMS.forEach((p) => params.append("platform", p));
    router.push(`/search?${params}`);
  };

  return (
    <div className="mt-6 w-full max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">최근 검색어</span>
        <button
          onClick={clearKeywords}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Trash2 className="w-3 h-3" />
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentKeywords.map((kw) => (
          <span
            key={kw}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <button onClick={() => handleClick(kw)} className="hover:underline">
              {kw}
            </button>
            <button
              onClick={() => removeKeyword(kw)}
              aria-label={`${kw} 삭제`}
              className="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
