export type Platform = "bungae" | "danggeun" | "joonggonara" | "helloumarket" | "vinted";

export type ProductCondition = "new" | "like_new" | "good" | "fair";

export interface Brand {
  id: string;
  name: string;
  nameKo?: string;
}

export interface Product {
  id: string;
  platform: Platform;
  title: string;
  price: number;
  condition: ProductCondition;
  imageUrl: string;
  productUrl: string;
  location?: string;
  sellerScore?: number;
  brand?: Brand;
  postedAt: string; // ISO 8601
}

export interface SearchResult {
  keyword: string;
  total: number;
  items: Product[];
  hasMore: boolean;
}

export interface SearchFilters {
  platforms: Platform[];
  sort: SortOption;
  category: Category;
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
}

export type Category =
  | "all"
  | "outer"
  | "top"
  | "bottom"
  | "dress"
  | "shoes"
  | "bag"
  | "accessory";

export type SortOption = "price_asc" | "latest" | "seller_score";
