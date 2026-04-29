import type { Platform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/constants";

type Props = {
  platform: Platform;
};

export const PlatformBadge = ({ platform }: Props) => {
  const meta = PLATFORM_META[platform];
  if (!meta) return null;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      {meta.label}
    </span>
  );
};
