import type { ProductCondition } from "@/lib/types";

const CONDITION_META: Record<ProductCondition, { label: string; color: string }> = {
  new:      { label: "새상품",     color: "bg-green-100 text-green-800" },
  like_new: { label: "미사용",     color: "bg-emerald-100 text-emerald-800" },
  good:     { label: "사용감 적음", color: "bg-gray-100 text-gray-700" },
  fair:     { label: "사용감 있음", color: "bg-gray-100 text-gray-500" },
};

type Props = {
  condition: ProductCondition;
};

const FALLBACK = { label: "기타", color: "bg-gray-100 text-gray-500" };

export const ConditionBadge = ({ condition }: Props) => {
  const meta = CONDITION_META[condition] ?? FALLBACK;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
};
