"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentKeywords: string[];
  addKeyword: (kw: string) => void;
  removeKeyword: (kw: string) => void;
  clearKeywords: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentKeywords: [],
      addKeyword: (kw) =>
        set((s) => ({
          recentKeywords: [kw, ...s.recentKeywords.filter((k) => k !== kw)].slice(0, 10),
        })),
      removeKeyword: (kw) =>
        set((s) => ({
          recentKeywords: s.recentKeywords.filter((k) => k !== kw),
        })),
      clearKeywords: () => set({ recentKeywords: [] }),
    }),
    { name: "search-store" },
  ),
);
