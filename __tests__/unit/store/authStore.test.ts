import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/authStore";

const reset = () =>
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });

describe("useAuthStore", () => {
  beforeEach(reset);

  it("초기 상태: 모두 null", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
  });

  describe("setTokens", () => {
    it("access/refresh 토큰 저장", () => {
      useAuthStore.getState().setTokens("acc-123", "ref-456");
      const { accessToken, refreshToken } = useAuthStore.getState();
      expect(accessToken).toBe("acc-123");
      expect(refreshToken).toBe("ref-456");
    });

    it("기존 토큰 덮어쓰기", () => {
      useAuthStore.getState().setTokens("old-acc", "old-ref");
      useAuthStore.getState().setTokens("new-acc", "new-ref");
      expect(useAuthStore.getState().accessToken).toBe("new-acc");
      expect(useAuthStore.getState().refreshToken).toBe("new-ref");
    });
  });

  describe("setUser", () => {
    it("유저 정보 저장", () => {
      useAuthStore.getState().setUser({ id: 1, email: "test@example.com" });
      expect(useAuthStore.getState().user).toEqual({ id: 1, email: "test@example.com" });
    });

    it("null로 유저 초기화", () => {
      useAuthStore.getState().setUser({ id: 1, email: "test@example.com" });
      useAuthStore.getState().setUser(null);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("logout", () => {
    it("토큰·유저 모두 초기화", () => {
      useAuthStore.getState().setTokens("acc", "ref");
      useAuthStore.getState().setUser({ id: 1, email: "a@b.com" });
      useAuthStore.getState().logout();
      const { accessToken, refreshToken, user } = useAuthStore.getState();
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
      expect(user).toBeNull();
    });
  });
});
