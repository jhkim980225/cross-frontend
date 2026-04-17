import type { Platform, SearchResult, SortOption, Category, Brand } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface SearchParams {
  keyword: string;
  platforms?: Platform[];
  page?: number;
  sort?: SortOption;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
}

export const searchProducts = async ({
  keyword,
  platforms,
  page = 1,
  sort,
  category,
  minPrice,
  maxPrice,
  brandId,
}: SearchParams): Promise<SearchResult> => {
  const params = new URLSearchParams({ keyword, page: String(page), size: String(PAGE_SIZE) });
  platforms?.forEach((p) => params.append("platform", p));
  if (sort) params.set("sort", sort);
  if (category && category !== "all") params.set("category", category);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (brandId) params.set("brandId", brandId);

  const res = await fetch(`${BASE_URL}/api/search?${params}`);
  if (!res.ok) throw new Error("검색 실패");
  return res.json();
};

export const fetchBrands = async (query?: string): Promise<Brand[]> => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  const res = await fetch(`${BASE_URL}/api/brands?${params}`);
  if (!res.ok) throw new Error("브랜드 목록 조회 실패");
  return res.json();
};
