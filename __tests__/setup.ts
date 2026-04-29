import "@testing-library/jest-dom";
import { vi, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

// ── Next.js 모듈 글로벌 mock ────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => "/"),
  redirect: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => {
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, fill: _fill, ...props }: Record<string, unknown>) => {
    const React = require("react");
    return React.createElement("img", { src, alt, ...props });
  },
}));

// ── 테스트 콘솔 노이즈 억제 ─────────────────────────────────────────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = String(args[0]);
    if (
      msg.includes("Warning:") ||
      msg.includes("act(") ||
      msg.includes("ReactDOM.render")
    ) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });
