import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

type Props = {
  count?: number;
};

export const SkeletonGrid = ({ count = 8 }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
