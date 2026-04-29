"use client";

const SOCIAL_PROVIDERS = [
  {
    key: "naver",
    label: "네이버로 계속하기",
    bg: "bg-[#03C75A] hover:bg-[#02b350]",
    text: "text-white",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
  {
    key: "kakao",
    label: "카카오로 계속하기",
    bg: "bg-[#FEE500] hover:bg-[#F0D800]",
    text: "text-[#3C1E1E]",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#3C1E1E">
        <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.62 1.65 4.93 4.14 6.3-.18.64-.66 2.32-.76 2.68-.12.45.17.44.36.32.14-.09 2.28-1.54 3.2-2.16.34.05.69.08 1.06.08 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
      </svg>
    ),
  },
  {
    key: "google",
    label: "Google로 계속하기",
    bg: "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
] as const;

export const SocialLoginButtons = () => {
  return (
    <div className="space-y-3">
      {SOCIAL_PROVIDERS.map((p) => (
        <button
          key={p.key}
          type="button"
          disabled
          className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-medium opacity-40 cursor-not-allowed ${p.bg} ${p.text}`}
        >
          {p.icon}
          {p.label}
          <span className="text-xs opacity-70">(준비중)</span>
        </button>
      ))}
    </div>
  );
};
