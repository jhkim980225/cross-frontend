import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

describe("formatPrice", () => {
  it("0원 포맷", () => {
    expect(formatPrice(0)).toBe("0원");
  });

  it("세 자리 구분자 포맷", () => {
    expect(formatPrice(1000)).toBe("1,000원");
  });

  it("백만 단위 포맷", () => {
    expect(formatPrice(1234567)).toBe("1,234,567원");
  });

  it("소수점 없는 정수", () => {
    expect(formatPrice(50000)).toBe("50,000원");
  });

  it("음수 포맷", () => {
    // 음수가 들어오면 그대로 포맷
    const result = formatPrice(-1000);
    expect(result).toContain("1,000원");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("방금 전 (< 1분)", () => {
    const date = new Date("2024-06-15T11:59:30Z").toISOString();
    expect(formatRelativeTime(date)).toBe("방금 전");
  });

  it("N분 전 (< 60분)", () => {
    const date = new Date("2024-06-15T11:45:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("15분 전");
  });

  it("N시간 전 (< 24시간)", () => {
    const date = new Date("2024-06-15T09:00:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("3시간 전");
  });

  it("N일 전 (< 30일)", () => {
    const date = new Date("2024-06-10T12:00:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("5일 전");
  });

  it("N개월 전 (>= 30일)", () => {
    const date = new Date("2024-04-15T12:00:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("2개월 전");
  });

  it("경계값: 정확히 60분 → 1시간 전", () => {
    const date = new Date("2024-06-15T11:00:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("1시간 전");
  });

  it("경계값: 정확히 24시간 → 1일 전", () => {
    const date = new Date("2024-06-14T12:00:00Z").toISOString();
    expect(formatRelativeTime(date)).toBe("1일 전");
  });
});
