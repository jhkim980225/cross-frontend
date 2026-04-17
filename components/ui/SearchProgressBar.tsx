"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
  isLoading: boolean;
};

export const SearchProgressBar = ({ isLoading }: Props) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setVisible(true);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 60) return prev + 3;
          if (prev < 85) return prev + 1;
          if (prev < 95) return prev + 0.3;
          return prev;
        });
      }, 100);
    } else if (visible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(timer);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          검색 중...
        </span>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
