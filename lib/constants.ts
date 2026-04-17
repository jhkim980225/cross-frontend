import type { Platform, SortOption, Category } from "@/lib/types";

export const PLATFORM_META: Record<Platform, { label: string; color: string }> = {
  bungae:       { label: "번개장터", color: "bg-yellow-100 text-yellow-800" },
  danggeun:     { label: "당근마켓", color: "bg-orange-100 text-orange-800" },
  joonggonara:  { label: "중고나라", color: "bg-red-100 text-red-800" },
  helloumarket: { label: "헬로마켓", color: "bg-blue-100 text-blue-800" },
  vinted:       { label: "Vinted",   color: "bg-teal-100 text-teal-800" },
};

export const ALL_PLATFORMS: Platform[] = ["bungae", "danggeun", "joonggonara", "helloumarket", "vinted"];

export const MVP_PLATFORMS: Platform[] = ["bungae", "danggeun"];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc", label: "최저가순" },
  { value: "latest", label: "최신순" },
  { value: "seller_score", label: "판매자 평점순" },
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "outer", label: "아우터" },
  { value: "top", label: "상의" },
  { value: "bottom", label: "하의" },
  { value: "dress", label: "원피스" },
  { value: "shoes", label: "신발" },
  { value: "bag", label: "가방" },
  { value: "accessory", label: "액세서리" },
];

export const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: "전체" },
  { label: "~1만원", max: 10000 },
  { label: "1~5만원", min: 10000, max: 50000 },
  { label: "5~10만원", min: 50000, max: 100000 },
  { label: "10~30만원", min: 100000, max: 300000 },
  { label: "30~50만원", min: 300000, max: 500000 },
  { label: "50만원~", min: 500000 },
];

export const PAGE_SIZE = 20;
