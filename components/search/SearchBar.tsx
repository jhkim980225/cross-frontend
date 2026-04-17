"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { MVP_PLATFORMS } from "@/lib/constants";

type Props = {
  size?: "lg" | "md";
  initialValue?: string;
};

export const SearchBar = ({ size = "md", initialValue = "" }: Props) => {
  const [keyword, setKeyword] = useState(initialValue);
  const router = useRouter();
  const addKeyword = useSearchStore((s) => s.addKeyword);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    addKeyword(trimmed);
    const params = new URLSearchParams({ q: trimmed });
    MVP_PLATFORMS.forEach((p) => params.append("platform", p));
    router.push(`/search?${params}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const isLg = size === "lg";

  return (
    <div
      className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 ${
        isLg ? "max-w-xl" : "max-w-md"
      } w-full`}
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="브랜드, 상품명, 모델명 검색"
        aria-label="검색어 입력"
        className={`flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 ${
          isLg ? "px-5 py-3 text-base" : "px-4 py-2 text-sm"
        }`}
      />
      <button
        onClick={handleSearch}
        aria-label="검색"
        className={`flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
          isLg ? "w-12 h-12" : "w-10 h-10"
        }`}
      >
        <Search className={isLg ? "w-5 h-5" : "w-4 h-4"} />
      </button>
    </div>
  );
};
