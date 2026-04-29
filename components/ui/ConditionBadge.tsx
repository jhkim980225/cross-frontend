import type { ProductCondition } from "@/lib/types";

const CONDITION_META: Record<ProductCondition, { label: string; color: string }> = {
  new:      { label: "새상품",     color: "bg-gray-900 text-white dark:bg-white dark:text-gray-900" },
  like_new: { label: "미사용",     color: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
  good:     { label: "사용감 적음", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  fair:     { label: "사용감 있음", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
};

type Props = {
  condition: ProductCondition;
};

const FALLBACK = { label: "기타", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };

export const ConditionBadge = ({ condition }: Props) => {
  const meta = CONDITION_META[condition] ?? FALLBACK;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
};
