import { http, HttpResponse } from "msw";

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string };
    if (body.email === "wrong@test.com") {
      return HttpResponse.json({ detail: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }
    return HttpResponse.json({
      access_token: "fake-access-token",
      refresh_token: "fake-refresh-token",
      token_type: "bearer",
    });
  }),

  http.get("/api/auth/me", ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.includes("fake-access-token")) {
      return HttpResponse.json({ detail: "인증 필요" }, { status: 401 });
    }
    return HttpResponse.json({ id: 1, email: "test@example.com", is_active: true, created_at: "2024-01-01T00:00:00Z" });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json() as { email?: string };
    if (body.email === "dup@test.com") {
      return HttpResponse.json({ detail: "이미 사용 중인 이메일입니다." }, { status: 400 });
    }
    return HttpResponse.json({ id: 2, email: body.email, is_active: true, created_at: new Date().toISOString() });
  }),

  http.post("/api/auth/refresh", async ({ request }) => {
    const body = await request.json() as { refresh_token?: string };
    if (body.refresh_token === "expired-refresh") {
      return HttpResponse.json({ detail: "토큰 만료" }, { status: 401 });
    }
    return HttpResponse.json({ access_token: "new-access-token" });
  }),

  // ── Search ────────────────────────────────────────────────────────────────
  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    if (keyword === "error") {
      return HttpResponse.json({ detail: "서버 오류" }, { status: 500 });
    }
    return HttpResponse.json({
      keyword,
      total: 2,
      hasMore: false,
      items: [
        {
          id: "p1",
          platform: "bungae",
          title: "나이키 에어맥스 테스트",
          price: 35000,
          condition: "good",
          imageUrl: "https://example.com/img1.jpg",
          productUrl: "https://bunjang.co.kr/p1",
          postedAt: new Date(Date.now() - 3600_000).toISOString(),
        },
        {
          id: "p2",
          platform: "danggeun",
          title: "아디다스 슈퍼스타 테스트",
          price: 28000,
          condition: "like_new",
          imageUrl: "https://example.com/img2.jpg",
          productUrl: "https://daangn.com/p2",
          postedAt: new Date(Date.now() - 7200_000).toISOString(),
        },
      ],
    });
  }),

  http.get("/api/search/autocomplete", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    return HttpResponse.json([`${q} 추천1`, `${q} 추천2`]);
  }),

  // ── Compare ───────────────────────────────────────────────────────────────
  http.get("/api/compare", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    if (q === "nodata") {
      return HttpResponse.json({ keyword: q, groups: [] });
    }
    return HttpResponse.json({
      keyword: q,
      groups: [
        {
          platforms: {
            danggeun:    { min_price: 18000, count: 89 },
            bungae:      { min_price: 25000, count: 134 },
            joonggonara: { min_price: 30000, count: 210 },
          },
        },
      ],
    });
  }),

  // ── Alerts ────────────────────────────────────────────────────────────────
  http.post("/api/alerts", async ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth) return HttpResponse.json({ detail: "인증 필요" }, { status: 401 });
    return new HttpResponse(null, { status: 201 });
  }),

  // ── Brands ────────────────────────────────────────────────────────────────
  http.get("/api/brands", () => {
    return HttpResponse.json([
      { id: "1", name: "Nike", nameKo: "나이키" },
      { id: "2", name: "Adidas", nameKo: "아디다스" },
    ]);
  }),
];
