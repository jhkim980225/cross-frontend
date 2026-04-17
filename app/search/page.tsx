import { Suspense } from "react";
import type { Platform, SortOption, Category } from "@/lib/types";
import { MVP_PLATFORMS, CATEGORIES } from "@/lib/constants";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilter } from "@/components/search/SearchFilter";
import { ProductList } from "@/components/product/ProductList";

type Props = {
  searchParams: {
    q?: string;
    platform?: string | string[];
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    brandId?: string;
  };
};

export default function SearchPage({ searchParams }: Props) {
  const keyword = searchParams.q ?? "";
  const platforms: Platform[] = searchParams.platform
    ? (Array.isArray(searchParams.platform) ? searchParams.platform : [searchParams.platform]).filter(
        (p): p is Platform => MVP_PLATFORMS.includes(p as Platform),
      )
    : MVP_PLATFORMS;
  const sort = (searchParams.sort as SortOption) ?? "latest";
  const category: Category = CATEGORIES.some((c) => c.value === searchParams.category)
    ? (searchParams.category as Category)
    : "all";
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const brandId = searchParams.brandId;

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-center mb-6">
        <SearchBar initialValue={keyword} />
      </div>

      <Suspense fallback={null}>
        <SearchFilter
          currentPlatforms={platforms}
          currentSort={sort}
          currentCategory={category}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentBrandId={brandId}
        />
      </Suspense>

      <div className="mt-6">
        <ProductList
          keyword={keyword}
          platforms={platforms}
          sort={sort}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          brandId={brandId}
        />
      </div>
    </main>
  );
}
