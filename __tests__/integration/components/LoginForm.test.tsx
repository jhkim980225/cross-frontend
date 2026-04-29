import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../utils/renderWithProviders";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";

// API 모듈 전체 mock
vi.mock("@/lib/api", () => ({
  authLogin: vi.fn(),
  authMe: vi.fn(),
}));

import * as api from "@/lib/api";

const mockTokens = { access_token: "fake-access", refresh_token: "fake-refresh", token_type: "bearer" };
const mockUser = { id: 1, email: "test@example.com", is_active: true, created_at: "" };

const mockPush = vi.fn();

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push: mockPush, replace: vi.fn(), back: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() } as ReturnType<typeof useRouter>);
  mockPush.mockClear();
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });
  vi.mocked(api.authLogin).mockResolvedValue(mockTokens);
  vi.mocked(api.authMe).mockResolvedValue(mockUser);
});

describe("LoginForm", () => {
  it("이메일·비밀번호 입력 필드 렌더링", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByPlaceholderText("example@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호 입력")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /이메일로 로그인/i })).toBeInTheDocument();
  });

  it("빈 폼 제출 시 유효성 에러 표시", async () => {
    renderWithProviders(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /이메일로 로그인/i }));
    expect(await screen.findByText("이메일과 비밀번호를 입력해주세요.")).toBeInTheDocument();
  });

  it("로그인 중 버튼 disabled 처리", async () => {
    // authLogin을 느리게 만들어 로딩 상태 관찰 가능하게 함
    let resolveLogin!: (v: typeof mockTokens) => void;
    vi.mocked(api.authLogin).mockImplementation(
      () => new Promise((res) => { resolveLogin = res; })
    );

    renderWithProviders(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("example@email.com"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("비밀번호 입력"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /이메일로 로그인/i }));

    // 로딩 중 상태 확인
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /로그인 중/i })).toBeDisabled();
    });

    // 프로미스 완료 → 정상 종료
    resolveLogin(mockTokens);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });

  it("로그인 성공 → 토큰·유저 저장 + 홈 리다이렉트", async () => {
    renderWithProviders(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("example@email.com"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("비밀번호 입력"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /이메일로 로그인/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe("fake-access");
      expect(useAuthStore.getState().user?.email).toBe("test@example.com");
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("로그인 실패 시 에러 메시지 표시", async () => {
    vi.mocked(api.authLogin).mockRejectedValue(new Error("이메일 또는 비밀번호가 올바르지 않습니다."));

    renderWithProviders(<LoginForm />);
    await userEvent.type(screen.getByPlaceholderText("example@email.com"), "wrong@test.com");
    await userEvent.type(screen.getByPlaceholderText("비밀번호 입력"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /이메일로 로그인/i }));

    expect(
      await screen.findByText("이메일 또는 비밀번호가 올바르지 않습니다.")
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalledWith("/");
  });

  it("비밀번호 표시 토글", async () => {
    renderWithProviders(<LoginForm />);
    const input = screen.getByPlaceholderText("비밀번호 입력") as HTMLInputElement;
    expect(input.type).toBe("password");
    const toggleBtn = input.closest("div")!.querySelector("button")!;
    await userEvent.click(toggleBtn);
    expect(input.type).toBe("text");
    await userEvent.click(toggleBtn);
    expect(input.type).toBe("password");
  });
});
