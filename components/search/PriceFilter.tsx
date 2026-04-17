"use client";

import { useState } from "react";
import { PRICE_PRESETS } from "@/lib/constants";

type Props = {
  currentMin?: number;
  currentMax?: number;
  onChange: (min?: number, max?: number) => void;
};

export const PriceFilter = ({ currentMin, currentMax, onChange }: Props) => {
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [showCustom, setShowCustom] = useState(false);

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
    const min = customMin ? Number(customMin) : undefined;
    const max = customMax ? Number(customMax) : undefined;
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
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
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
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
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
            className="w-24 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">~</span>
          <input
            type="number"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            placeholder="최대"
            className="w-24 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">원</span>
          <button
            onClick={handleCustomApply}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            적용
          </button>
        </div>
      )}
    </div>
  );
};
