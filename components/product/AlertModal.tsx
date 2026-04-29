"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { createAlert } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Props = {
  keyword: string;
  onClose: () => void;
};

export const AlertModal = ({ keyword, onClose }: Props) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(targetPrice.replace(/,/g, ""));
    if (!price || price <= 0) {
      setError("올바른 금액을 입력해주세요.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await createAlert(keyword, price);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알림 설정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-xs shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">가격 알림 설정</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="font-medium text-gray-900 dark:text-white">&ldquo;{keyword}&rdquo;</span> 검색 결과 중
          목표 가격 이하 상품이 나오면 알려드릴게요.
        </p>

        {success ? (
          <div className="text-center py-4">
            <p className="text-sm text-green-600 font-medium">알림이 설정되었습니다!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            <div>
              <label htmlFor="alert-price" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                목표 가격
              </label>
              <div className="relative">
                <input
                  id="alert-price"
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="예: 50000"
                  min={0}
                  className="w-full pr-8 pl-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
              </div>
              {targetPrice && Number(targetPrice) > 0 && (
                <p className="text-xs text-gray-400 mt-1">{formatPrice(Number(targetPrice))} 이하 시 알림</p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 text-sm text-white bg-gray-900 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {isLoading ? "설정 중..." : "알림 설정"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
