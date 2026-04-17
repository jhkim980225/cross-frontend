export const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 overflow-hidden dark:border-gray-700">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  );
};
