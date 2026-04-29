import type { Platform, SearchResult, SortOption, Category, Brand } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";

// ── Auth types ──────────────────────────────────────────────────────────────
export interface UserResponse {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 개발: NEXT_PUBLIC_API_URL 미설정 시 "" → Next.js rewrite proxy(/api/*) 사용
// 프로덕션: NEXT_PUBLIC_API_URL=https://api.example.com 으로 직접 지정
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface SearchParams {
  keyword: string;
  platforms?: Platform[];
  page?: number;
  sort?: SortOption;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
}

export const searchProducts = async (
  { keyword, platforms, page = 1, sort, category, minPrice, maxPrice, brandId }: SearchParams,
  signal?: AbortSignal,
): Promise<SearchResult> => {
  const params = new URLSearchParams({ keyword, page: String(page), size: String(PAGE_SIZE) });
  platforms?.forEach((p) => params.append("platform", p));
  if (sort) params.set("sort", sort);
  if (category && category !== "all") params.set("category", category);
  if (minPrice !== undefined) params.set("min_price", String(minPrice));
  if (maxPrice !== undefined) params.set("max_price", String(maxPrice));
  if (brandId) params.set("brandId", brandId);

  const res = await fetch(`${BASE_URL}/api/search?${params}`, { signal });
  if (!res.ok) throw new Error("검색 실패");
  return res.json();
};

export const fetchSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  const res = await fetch(`${BASE_URL}/api/search/autocomplete?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json) ? json : (json.suggestions ?? json.data ?? []);
};

export const fetchBrands = async (query?: string): Promise<Brand[]> => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  const res = await fetch(`${BASE_URL}/api/brands?${params}`);
  if (!res.ok) throw new Error("브랜드 목록 조회 실패");
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? json.brands ?? json.items ?? []);
};

// ── Auth API ─────────────────────────────────────────────────────────────────
export const authLogin = async (email: string, password: string): Promise<TokenResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return res.json();
};

export const authRegister = async (email: string, password: string): Promise<UserResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "회원가입에 실패했습니다.");
  }
  return res.json();
};

export const authLogout = async (accessToken: string): Promise<void> => {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const authMe = async (accessToken: string): Promise<UserResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("인증 필요");
  return res.json();
};

export const authRefresh = async (refreshToken: string): Promise<{ access_token: string }> => {
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error("토큰 갱신 실패");
  return res.json();
};

// ── Compare API ───────────────────────────────────────────────────────────────
export interface CompareResult {
  keyword: string;
  groups: Array<{
    platforms: Record<string, { min_price: number; count: number }>;
  }>;
}

export const fetchCompare = async (keyword: string): Promise<CompareResult> => {
  const res = await fetch(`${BASE_URL}/api/compare?q=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("비교 데이터 조회 실패");
  return res.json();
};

// ── Alerts API ────────────────────────────────────────────────────────────────
export const createAlert = async (keyword: string, targetPrice: number): Promise<void> => {
  const { authFetch } = await import("@/lib/authFetch");
  const res = await authFetch(`${BASE_URL}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, target_price: targetPrice }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "알림 설정 실패");
  }
};
