import type { Platform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/constants";

type Props = {
  platform: Platform;
};

export const PlatformBadge = ({ platform }: Props) => {
  const meta = PLATFORM_META[platform];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
      {meta.label}
    </span>
  );
};
