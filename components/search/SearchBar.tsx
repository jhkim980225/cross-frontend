"use client";

import { useState, useRef, useDeferredValue, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { MVP_PLATFORMS } from "@/lib/constants";
import { fetchSuggestions } from "@/lib/api";

type Props = {
  size?: "lg" | "md";
  initialValue?: string;
  currentParamsStr?: string; // 서버에서 전달 — 필터 유지용 (없으면 홈 페이지)
};

export const SearchBar = ({ size = "md", initialValue = "", currentParamsStr }: Props) => {
  const [keyword, setKeyword] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { recentKeywords, addKeyword, removeKeyword } = useSearchStore();

  const deferredKeyword = useDeferredValue(keyword.trim());

  // 백엔드 자동완성 (Redis → DB ILIKE)
  const { data: apiSuggestions = [] } = useQuery({
    queryKey: ["autocomplete", deferredKeyword],
    queryFn: () => fetchSuggestions(deferredKeyword),
    enabled: deferredKeyword.length >= 2,
    staleTime: 30_000,
  });

  // 입력값 있으면 API 결과 + 로컬 필터링 병합, 없으면 최근 검색어 전체
  const suggestions = useMemo<string[]>(() => {
    if (!deferredKeyword) return recentKeywords;
    return Array.from(
      new Set([
        ...apiSuggestions,
        ...recentKeywords.filter((k) => k.includes(deferredKeyword) && k !== deferredKeyword),
      ]),
    ).slice(0, 8);
  }, [deferredKeyword, apiSuggestions, recentKeywords]);

  const isOpen = open && suggestions.length > 0;

  const handleSearch = (kw = keyword) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    addKeyword(trimmed);
    setKeyword(trimmed);
    setOpen(false);
    setActiveIndex(-1);
    // 기존 필터 파라미터 유지, q만 교체
    const params = new URLSearchParams(currentParamsStr ?? "");
    params.set("q", trimmed);
    if (!params.has("platform")) {
      MVP_PLATFORMS.forEach((p) => params.append("platform", p));
    }
    router.push(`/search?${params}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSearch(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 키워드 바뀌면 activeIndex 초기화
  useEffect(() => {
    setActiveIndex(-1);
  }, [deferredKeyword]);

  const isLg = size === "lg";

  return (
    <div ref={containerRef} className={`relative ${isLg ? "max-w-xl" : "max-w-md"} w-full`}>
      <div
        className={`flex items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-gray-400 bg-white dark:bg-gray-900`}
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="브랜드, 상품명, 모델명 검색"
          aria-label="검색어 입력"
          aria-autocomplete="list"
          className={`flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 ${
            isLg ? "px-5 py-3 text-base" : "px-4 py-2 text-sm"
          }`}
        />
        {keyword && (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setKeyword(""); setOpen(false); }}
            aria-label="검색어 지우기"
            className="p-1 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          aria-label="검색"
          className={`flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors flex-shrink-0 ${
            isLg ? "w-12 h-12" : "w-10 h-10"
          }`}
        >
          <Search className={isLg ? "w-5 h-5" : "w-4 h-4"} />
        </button>
      </div>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden"
        >
          {!deferredKeyword && (
            <li className="px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500">
              최근 검색어
            </li>
          )}
          {suggestions.map((s, i) => (
            <li key={s} role="option" aria-selected={i === activeIndex}>
              <div
                className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
                  i === activeIndex
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSearch(s)}
                  className="flex items-center gap-2 flex-1 text-sm text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {deferredKeyword
                    ? s.split(deferredKeyword).map((part: string, idx: number, arr: string[]) =>
                        idx < arr.length - 1 ? (
                          <span key={idx}>
                            {part}
                            <span className="font-semibold">{deferredKeyword}</span>
                          </span>
                        ) : (
                          <span key={idx}>{part}</span>
                        ),
                      )
                    : s}
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => removeKeyword(s)}
                  aria-label={`${s} 삭제`}
                  className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
