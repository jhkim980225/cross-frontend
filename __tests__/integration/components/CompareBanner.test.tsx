import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/renderWithProviders";
import { CompareBanner } from "@/components/product/CompareBanner";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CompareBanner", () => {
  it("keyword 없으면 null 반환", () => {
    const { container } = renderWithProviders(<CompareBanner keyword="" />);
    expect(container.firstChild).toBeNull();
  });

  it("로딩 중에는 렌더링 없음", () => {
    const { container } = renderWithProviders(<CompareBanner keyword="나이키" />);
    // 초기 렌더 즉시는 아무것도 없음 (useQuery 로딩 중)
    expect(container.firstChild).toBeNull();
  });

  it("API 성공 → 플랫폼 최저가 목록 렌더링", async () => {
    renderWithProviders(<CompareBanner keyword="나이키" />);
    await waitFor(() => {
      expect(screen.getByText("당근마켓")).toBeInTheDocument();
    });
    expect(screen.getByText("번개장터")).toBeInTheDocument();
    expect(screen.getByText("중고나라")).toBeInTheDocument();
  });

  it("최저가 플랫폼에 '최저' 배지 표시", async () => {
    renderWithProviders(<CompareBanner keyword="나이키" />);
    await waitFor(() => {
      expect(screen.getByText("최저")).toBeInTheDocument();
    });
  });

  it("최저가 순서 정렬 확인 (당근 18,000원이 최저)", async () => {
    renderWithProviders(<CompareBanner keyword="나이키" />);
    await waitFor(() => {
      expect(screen.getByText(/18,000원/)).toBeInTheDocument();
    });
    // 당근(18,000)이 번개(25,000)보다 앞에 위치
    const items = screen.getAllByText(/원~/);
    expect(items[0].textContent).toContain("18,000");
    expect(items[1].textContent).toContain("25,000");
    expect(items[2].textContent).toContain("30,000");
  });

  it("count 표시 (개수)", async () => {
    renderWithProviders(<CompareBanner keyword="나이키" />);
    await waitFor(() => {
      expect(screen.getByText("89개")).toBeInTheDocument();
    });
    expect(screen.getByText("134개")).toBeInTheDocument();
    expect(screen.getByText("210개")).toBeInTheDocument();
  });

  it("데이터 없을 때 null 반환", async () => {
    const { container } = renderWithProviders(<CompareBanner keyword="nodata" />);
    // 잠시 대기 후 여전히 null
    await new Promise((r) => setTimeout(r, 100));
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("API 에러 시 렌더링 없음", async () => {
    server.use(
      http.get("/api/compare", () => HttpResponse.json({ detail: "오류" }, { status: 500 }))
    );
    const { container } = renderWithProviders(<CompareBanner keyword="에러테스트" />);
    await new Promise((r) => setTimeout(r, 100));
    expect(container.firstChild).toBeNull();
  });

  it("헤더 텍스트 '플랫폼별 최저가' 렌더링", async () => {
    renderWithProviders(<CompareBanner keyword="나이키" />);
    await waitFor(() => {
      expect(screen.getByText(/플랫폼별 최저가/i)).toBeInTheDocument();
    });
  });
});
