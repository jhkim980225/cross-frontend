import { useAuthStore } from "@/lib/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// 순환 참조 방지를 위해 refresh를 여기서 직접 구현
const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error("토큰 갱신 실패");
  const data = await res.json();
  return data.access_token;
};

// Bearer 토큰 자동 첨부 + 401 시 자동 갱신 후 재시도
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore.getState();

  const makeRequest = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const res = await makeRequest(accessToken);

  if (res.status === 401 && refreshToken) {
    try {
      const newToken = await refreshAccessToken(refreshToken);
      setTokens(newToken, refreshToken);
      return makeRequest(newToken);
    } catch {
      logout();
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  return res;
};
