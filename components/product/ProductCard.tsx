"use client";

import { useState, memo } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { ConditionBadge } from "@/components/ui/ConditionBadge";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { AlertModal } from "@/components/product/AlertModal";

type Props = {
  product: Product;
  keyword?: string;
};

// 번개장터 CDN은 {res}를 실제 해상도로 교체해야 함
const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return url.replace("{res}", "300");
};

const ImagePlaceholder = () => (
  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

export const ProductCard = memo(function ProductCard({ product, keyword = "" }: Props) {
  const imageUrl = resolveImageUrl(product.imageUrl);
  const [imgError, setImgError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useAuthStore();

  const handleAlertClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("가격 알림은 로그인 후 이용할 수 있습니다.");
      return;
    }
    setShowAlert(true);
  };

  return (
    <>
      <a
        href={product.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow dark:border-gray-700"
      >
        {/* 가격 알림 버튼 */}
        <button
          onClick={handleAlertClick}
          aria-label="가격 알림 설정"
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-400 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <PlatformBadge platform={product.platform} />
            <ConditionBadge condition={product.condition} />
          </div>
          <p className="text-xs text-gray-400">{formatRelativeTime(product.postedAt)}</p>
        </div>
      </a>

      {showAlert && (
        <AlertModal
          keyword={keyword}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
});
