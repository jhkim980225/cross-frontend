import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export const metadata = {
  title: "회원가입 | 중고마켓 통합검색",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-900 dark:text-white hover:underline transition-colors"
        >
          중고마켓 통합검색
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 px-8 py-10">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
