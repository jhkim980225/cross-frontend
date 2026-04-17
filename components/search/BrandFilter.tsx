"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { fetchBrands } from "@/lib/api";
import type { Brand } from "@/lib/types";

type Props = {
  currentBrandId?: string;
  onChange: (brandId?: string) => void;
};

export const BrandFilter = ({ currentBrandId, onChange }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands", query],
    queryFn: () => fetchBrands(query || undefined),
    staleTime: 60_000,
  });

  const selectedBrand = brands.find((b) => b.id === currentBrandId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (brand: Brand) => {
    onChange(brand.id);
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setQuery("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">브랜드</span>

      {currentBrandId && selectedBrand ? (
        <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400">
          {selectedBrand.nameKo ?? selectedBrand.name}
          <button onClick={handleClear} aria-label="브랜드 선택 해제">
            <X className="w-3 h-3" />
          </button>
        </span>
      ) : null}

      <div ref={containerRef} className="relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="w-3.5 h-3.5 text-gray-400 ml-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="브랜드 검색"
            className="w-32 text-xs px-2 py-1.5 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
          />
        </div>

        {open && brands.length > 0 && (
          <ul className="absolute z-20 mt-1 w-48 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {brands.map((brand) => (
              <li key={brand.id}>
                <button
                  onClick={() => handleSelect(brand)}
                  className={`w-full text-left text-xs px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    brand.id === currentBrandId
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {brand.nameKo ? `${brand.nameKo} (${brand.name})` : brand.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
