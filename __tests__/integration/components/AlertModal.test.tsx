import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../utils/renderWithProviders";
import { AlertModal } from "@/components/product/AlertModal";

// createAlert 직접 mock (authFetch / fetch 레이어 우회)
vi.mock("@/lib/api", () => ({
  createAlert: vi.fn(),
}));

import * as api from "@/lib/api";

const onClose = vi.fn();

beforeEach(() => {
  onClose.mockClear();
  vi.mocked(api.createAlert).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AlertModal", () => {
  it("키워드 텍스트 + 폼 요소 렌더링", () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    expect(screen.getByText(/나이키/)).toBeInTheDocument();
    expect(screen.getByLabelText("목표 가격")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "알림 설정" })).toBeInTheDocument();
  });

  it("취소 버튼 클릭 → onClose 호출", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("오버레이 클릭 → onClose 호출", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    const overlay = document.querySelector(".fixed.inset-0")!;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("가격 미입력 제출 → 에러 표시", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));
    expect(await screen.findByText("올바른 금액을 입력해주세요.")).toBeInTheDocument();
    expect(api.createAlert).not.toHaveBeenCalled();
  });

  it("가격 미리보기 텍스트 (입력 시)", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "50000");
    expect(screen.getByText(/50,000원 이하 시 알림/)).toBeInTheDocument();
  });

  it("유효 가격 제출 → createAlert 호출 (올바른 인자)", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "30000");
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));

    await waitFor(() => {
      expect(api.createAlert).toHaveBeenCalledWith("나이키", 30000);
    });
  });

  it("API 성공 → 성공 메시지 표시", async () => {
    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "30000");
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));

    expect(await screen.findByText("알림이 설정되었습니다!")).toBeInTheDocument();
  });

  it("API 성공 후 1500ms 뒤 자동 닫힘", async () => {
    // setTimeout 스파이로 fake timer 충돌 없이 콜백 수동 실행
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");

    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "30000");
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));

    await screen.findByText("알림이 설정되었습니다!");

    const autoCloseCall = setTimeoutSpy.mock.calls.find(([, delay]) => delay === 1500);
    expect(autoCloseCall).toBeDefined();
    act(() => (autoCloseCall![0] as () => void)());
    expect(onClose).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
  });

  it("API 실패 → 에러 메시지 표시", async () => {
    vi.mocked(api.createAlert).mockRejectedValue(new Error("서버 오류"));

    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "30000");
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));

    expect(await screen.findByText("서버 오류")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("로딩 중 버튼 disabled", async () => {
    let resolveFn!: () => void;
    vi.mocked(api.createAlert).mockImplementation(
      () => new Promise<void>((res) => { resolveFn = res; })
    );

    renderWithProviders(<AlertModal keyword="나이키" onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("목표 가격"), "30000");
    await userEvent.click(screen.getByRole("button", { name: "알림 설정" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "설정 중..." })).toBeDisabled();
    });

    resolveFn();
  });
});
