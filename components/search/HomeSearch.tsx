"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { RecentKeywords } from "@/components/search/RecentKeywords";
import { CATEGORY_TREE, isCategoryGroup } from "@/lib/constants";
import type { Category } from "@/lib/types";

export const HomeSearch = () => {
  const [category, setCategory] = useState<Category>("all");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const currentParamsStr =
    category !== "all" ? `category=${category}` : "";

  const handleGroupToggle = (group: string) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  const handleLeaf = (value: Category) => {
    setCategory(value);
    setOpenGroup(null);
  };

  const activeGroup = CATEGORY_TREE.find(
    (n) => isCategoryGroup(n) && n.children.some((c) => c.value === category)
  );
  const activeGroupKey = activeGroup && isCategoryGroup(activeGroup) ? activeGroup.group : null;

  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar size="lg" currentParamsStr={currentParamsStr} />

      {/* 카테고리 칩 — 1행: 리프 + 그룹 헤더 */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl w-full">
        {CATEGORY_TREE.map((node) => {
          if (isCategoryGroup(node)) {
            const isOpen = openGroup === node.group;
            const isGroupActive = activeGroupKey === node.group;
            return (
              <button
                key={node.group}
                onClick={() => handleGroupToggle(node.group)}
                className={`flex items-center gap-1 text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  isGroupActive
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
                }`}
              >
                {node.label}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            );
          }
          const active = category === node.value;
          return (
            <button
              key={node.value}
              onClick={() => handleLeaf(node.value)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
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

      {/* 2행: 펼쳐진 그룹의 자식 칩 */}
      {openGroup && (() => {
        const group = CATEGORY_TREE.find(
          (n) => isCategoryGroup(n) && n.group === openGroup
        );
        if (!group || !isCategoryGroup(group)) return null;
        return (
          <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-2xl w-full">
            {group.children.map((child) => {
              const active = category === child.value;
              return (
                <button
                  key={child.value}
                  onClick={() => handleLeaf(child.value)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
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
      })()}

      <RecentKeywords />
    </div>
  );
};
