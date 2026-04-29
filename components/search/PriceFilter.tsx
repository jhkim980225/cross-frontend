"use client";

import { useState, useEffect } from "react";
import { PRICE_PRESETS } from "@/lib/constants";

type Props = {
  currentMin?: number;
  currentMax?: number;
  onChange: (min?: number, max?: number) => void;
};

export const PriceFilter = ({ currentMin, currentMax, onChange }: Props) => {
  const isCustomActive =
    (currentMin !== undefined || currentMax !== undefined) &&
    !PRICE_PRESETS.some((p) => p.min === currentMin && p.max === currentMax);

  const [customMin, setCustomMin] = useState(currentMin !== undefined ? String(currentMin) : "");
  const [customMax, setCustomMax] = useState(currentMax !== undefined ? String(currentMax) : "");
  const [showCustom, setShowCustom] = useState(isCustomActive);

  // URL 파라미터가 바뀌면 custom 입력값 동기화
  useEffect(() => {
    if (isCustomActive) {
      setCustomMin(currentMin !== undefined ? String(currentMin) : "");
      setCustomMax(currentMax !== undefined ? String(currentMax) : "");
      setShowCustom(true);
    }
  }, [currentMin, currentMax, isCustomActive]);

  const isPresetActive = (preset: (typeof PRICE_PRESETS)[number]) => {
    if (preset.min === undefined && preset.max === undefined) {
      return currentMin === undefined && currentMax === undefined;
    }
    return currentMin === preset.min && currentMax === preset.max;
  };

  const handlePreset = (preset: (typeof PRICE_PRESETS)[number]) => {
    setShowCustom(false);
    onChange(preset.min, preset.max);
  };

  const handleCustomApply = () => {
    // "" 체크 (truthy 체크 금지 — "0" 입력 시 falsy로 처리되는 버그)
    const min = customMin !== "" ? Number(customMin) : undefined;
    const max = customMax !== "" ? Number(customMax) : undefined;
    if (min !== undefined && max !== undefined && min > max) return;
    onChange(min, max);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">가격</span>
        {PRICE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePreset(preset)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              isPresetActive(preset)
                ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            showCustom
              ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
              : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400"
          }`}
        >
          직접 입력
        </button>
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 pl-[52px]">
          <input
            type="number"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            placeholder="최소"
            className="w-24 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-gray-400"
          />
          <span className="text-gray-400">~</span>
          <input
            type="number"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            placeholder="최대"
            className="w-24 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-gray-400"
          />
          <span className="text-xs text-gray-400">원</span>
          <button
            onClick={handleCustomApply}
            className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
          >
            적용
          </button>
        </div>
      )}
    </div>
  );
};
