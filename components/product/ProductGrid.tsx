import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

type Props = {
  items: Product[];
  keyword?: string;
};

export const ProductGrid = ({ items, keyword }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ProductCard key={`${item.platform}-${item.id}`} product={item} keyword={keyword} />
      ))}
    </div>
  );
};
