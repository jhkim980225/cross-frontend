"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { authLogout } from "@/lib/api";

export const HeaderAuth = () => {
  const { user, accessToken, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    if (accessToken) {
      await authLogout(accessToken).catch(() => {});
    }
    logout();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
      >
        회원가입
      </Link>
    </div>
  );
};
