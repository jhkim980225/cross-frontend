import type { Platform, SortOption, Category } from "@/lib/types";

export type CategoryLeaf  = { value: Category; label: string };
export type CategoryGroup = { group: string; label: string; children: CategoryLeaf[] };
export type CategoryNode  = CategoryLeaf | CategoryGroup;
export function isCategoryGroup(n: CategoryNode): n is CategoryGroup {
  return "group" in n;
}

export const PLATFORM_META: Record<Platform, { label: string; bg: string; text: string }> = {
  bungae:      { label: "번개장터", bg: "#FF6B2C", text: "#fff" },
  danggeun:    { label: "당근마켓", bg: "#1DBE6B", text: "#fff" },
  joonggonara: { label: "중고나라", bg: "#3478F6", text: "#fff" },
  hellomarket: { label: "헬로마켓", bg: "#6B7280", text: "#fff" },
  vinted:      { label: "Vinted",   bg: "#7B61FF", text: "#fff" },
};

export const ALL_PLATFORMS: Platform[] = ["bungae", "danggeun", "joonggonara", "hellomarket", "vinted"];

export const MVP_PLATFORMS: Platform[] = ["bungae", "danggeun", "joonggonara", "vinted"];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "price_asc", label: "최저가순" },
  { value: "price_desc", label: "최고가순" },
  { value: "seller_score", label: "판매자 평점순" },
];

export const CATEGORY_TREE: CategoryNode[] = [
  { value: "all", label: "전체" },
  { group: "clothing", label: "의류", children: [
    { value: "outer",  label: "아우터" },
    { value: "top",    label: "상의"   },
    { value: "bottom", label: "하의"   },
    { value: "dress",  label: "원피스" },
  ]},
  { value: "shoes",     label: "신발"     },
  { value: "bag",       label: "가방"     },
  { value: "accessory", label: "액세서리" },
  { group: "furniture", label: "가구/인테리어", children: [
    { value: "sofa",    label: "소파"     },
    { value: "bed",     label: "침대"     },
    { value: "desk",    label: "책상/의자" },
    { value: "storage", label: "수납/정리" },
    { value: "lighting",label: "조명"     },
  ]},
];

// 기존 CATEGORIES → 트리에서 플랫화 (API 검증·하위 호환)
export const CATEGORIES: CategoryLeaf[] = [
  { value: "all", label: "전체" },
  ...CATEGORY_TREE.flatMap((n) =>
    isCategoryGroup(n) ? n.children : (n as CategoryLeaf).value !== "all" ? [n as CategoryLeaf] : []
  ),
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
