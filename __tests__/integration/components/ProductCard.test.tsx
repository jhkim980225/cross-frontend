import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../utils/renderWithProviders";
import { ProductCard } from "@/components/product/ProductCard";
import { useAuthStore } from "@/lib/authStore";
import type { Product } from "@/lib/types";

const mockProduct: Product = {
  id: "test-1",
  platform: "bungae",
  title: "나이키 에어맥스 90",
  price: 45000,
  condition: "good",
  imageUrl: "https://example.com/image.jpg",
  productUrl: "https://bunjang.co.kr/products/test-1",
  postedAt: new Date(Date.now() - 3600_000).toISOString(),
};

const mockProductNoImage: Product = {
  ...mockProduct,
  id: "test-2",
  imageUrl: "",
};

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });
});

describe("ProductCard", () => {
  it("상품명·가격 렌더링", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText("나이키 에어맥스 90")).toBeInTheDocument();
    expect(screen.getByText("45,000원")).toBeInTheDocument();
  });

  it("플랫폼 뱃지 렌더링", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText("번개장터")).toBeInTheDocument();
  });

  it("상품 링크 올바른 href 연결", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://bunjang.co.kr/products/test-1");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("이미지 없을 때 플레이스홀더 SVG 렌더링", () => {
    renderWithProviders(<ProductCard product={mockProductNoImage} />);
    // SVG 플레이스홀더 존재 확인
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("이미지 로드 실패 시 플레이스홀더로 전환", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    // 이미지가 사라지고 SVG 플레이스홀더 등장
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("가격 알림 버튼 존재 (aria-label)", () => {
    renderWithProviders(<ProductCard product={mockProduct} keyword="나이키" />);
    expect(screen.getByRole("button", { name: "가격 알림 설정" })).toBeInTheDocument();
  });

  it("비로그인 상태에서 알림 버튼 클릭 → alert 표시", () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    renderWithProviders(<ProductCard product={mockProduct} keyword="나이키" />);
    fireEvent.click(screen.getByRole("button", { name: "가격 알림 설정" }));
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("로그인"));
    alertMock.mockRestore();
  });

  it("로그인 상태에서 알림 버튼 클릭 → AlertModal 열림", () => {
    useAuthStore.setState({ accessToken: "tok", refreshToken: "ref", user: { id: 1, email: "u@u.com" } });
    renderWithProviders(<ProductCard product={mockProduct} keyword="나이키" />);
    fireEvent.click(screen.getByRole("button", { name: "가격 알림 설정" }));
    // 모달 헤더 "가격 알림 설정" h3
    expect(screen.getByRole("heading", { name: "가격 알림 설정" })).toBeInTheDocument();
    // 폼 내 label
    expect(screen.getByLabelText("목표 가격")).toBeInTheDocument();
  });

  it("상대 시간 표시", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/시간 전|분 전|방금 전|일 전/)).toBeInTheDocument();
  });
});
