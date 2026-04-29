# 중고마켓 통합검색 — 프론트엔드

## 프로젝트 개요

번개장터·당근마켓·중고나라 등 여러 중고 플랫폼의 상품을 한 번에 검색·비교하는 서비스의 프론트엔드.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **Server State**: TanStack React Query v5
- **Client State**: Zustand v4 (persist middleware)
- **Icons**: Lucide React

## 서버 실행

```bash
PORT=3214 npm run dev   # 개발 서버
npm run build           # 프로덕션 빌드
npm run lint            # ESLint 검사
```

백엔드는 **8945 포트**에서 실행. Next.js rewrite proxy로 CORS 우회.
- 브라우저 `/api/*` → Next.js 서버 → `http://127.0.0.1:8945/api/*`
- `BACKEND_URL` 환경변수로 백엔드 주소 변경 가능

## 환경변수

| 변수 | 기본값 | 용도 |
|------|--------|------|
| `PORT` | 3000 | Next.js 개발 서버 포트 |
| `BACKEND_URL` | `http://127.0.0.1:8945` | rewrite proxy 대상 (서버 전용) |
| `NEXT_PUBLIC_API_URL` | `""` (빈 문자열) | 클라이언트 API base URL. 미설정 시 proxy 사용 |

## 디렉토리 구조

```
app/
  page.tsx              # 메인 홈 (서버 컴포넌트)
  search/page.tsx       # 검색 결과 (force-dynamic, 서버 컴포넌트)
  login/page.tsx        # 로그인
  signup/page.tsx       # 회원가입

components/
  auth/
    HeaderAuth.tsx      # 헤더 로그인 상태 표시 (클라이언트)
    LoginForm.tsx       # 이메일 로그인 폼
    SignupForm.tsx      # 회원가입 폼
    SocialLoginButtons.tsx  # 네이버·카카오·구글 OAuth 버튼
  product/
    ProductList.tsx     # 무한스크롤 검색 결과 (useInfiniteQuery)
    ProductCard.tsx     # 상품 카드
    ProductGrid.tsx     # 2~4열 그리드
    SkeletonGrid.tsx    # 로딩 스켈레톤
  search/
    HomeSearch.tsx      # 홈 검색창 + 카테고리 칩 (클라이언트)
    SearchBar.tsx       # 검색바 + 자동완성 드롭다운
    SearchFilter.tsx    # 카테고리·플랫폼·정렬 필터
    PriceFilter.tsx     # 가격 필터 (프리셋 + 직접입력)
    BrandFilter.tsx     # 브랜드 검색 필터
    RecentKeywords.tsx  # 최근 검색어

lib/
  api.ts        # 백엔드 fetch 함수 전체 (search, autocomplete, brands, auth)
  types.ts      # TypeScript 타입 정의
  constants.ts  # 플랫폼 메타, 카테고리, 정렬 옵션, 가격 프리셋
  authStore.ts  # Zustand auth 스토어 (토큰 + 유저 localStorage 저장)
  utils.ts      # formatPrice, formatRelativeTime

store/
  searchStore.ts  # Zustand 최근 검색어 스토어 (localStorage 저장)
```

## 핵심 설계 결정

### API 프록시 (CORS 우회)
모든 `/api/*` 요청은 `next.config.mjs`의 rewrite를 통해 백엔드로 프록시됨.
`lib/api.ts`의 `BASE_URL`은 빈 문자열(`""`)이므로 `/api/search` 같은 상대경로 사용.

### 인증 (JWT)
- 로그인/회원가입 성공 → `access_token` + `refresh_token` 발급
- `lib/authStore.ts` (Zustand persist) → `auth-storage` 키로 localStorage 저장
- `GET /api/auth/me` Bearer 토큰으로 유저 정보 확인
- 소셜 로그인(네이버·카카오·구글)은 `window.location.href` 리다이렉트 방식 → CORS 무관

### 검색 필터 유지
검색어 재입력 시 기존 필터(카테고리·가격·플랫폼 등) 유지.
`SearchBar`가 `currentParamsStr` prop으로 기존 URL params를 받아 `q`만 교체.

### 무한스크롤
`useInfiniteQuery` + `IntersectionObserver` sentinel 패턴.
sentinel div가 뷰포트 200px 이내 진입 시 `fetchNextPage()` 호출.

### 자동완성
`useDeferredValue`로 디바운스 → `GET /api/search/autocomplete?q=...` 호출.
API 결과 + localStorage 최근검색어 병합, 최대 8개 표시.

## 백엔드 API 주요 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/search` | 상품 검색 (keyword, platform[], sort, category, min_price, max_price, page, size) |
| GET | `/api/search/autocomplete` | 자동완성 (q, limit) |
| GET | `/api/brands` | 브랜드 목록 |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/auth/register` | 회원가입 { email, password } |
| POST | `/api/auth/login` | 로그인 → { access_token, refresh_token } |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/logout` | 로그아웃 (Bearer 토큰 필요) |
| GET | `/api/auth/me` | 현재 유저 정보 (Bearer 토큰 필요) |

**주의**: 검색 파라미터는 `min_price` / `max_price` (snake_case). `keyword` 또는 `q` 둘 다 수용.

## 알려진 이슈 및 주의사항

- **번개장터 이미지**: CDN URL에 `{res}` 플레이스홀더 포함 → `ProductCard`에서 `300`으로 치환
- **플랫폼명**: API는 `hellomarket` (프론트 타입도 동일하게 맞춤, 과거 `helloumarket` 오타 수정됨)
- **소셜 로그인**: 백엔드 OAuth 엔드포인트 (`/oauth2/authorization/{provider}`) 미구현 상태
- **닉네임**: 회원가입 폼에 닉네임 필드 있으나 API `RegisterRequest`에 해당 필드 없어 전송 안 됨
- `search/page.tsx`는 `export const dynamic = "force-dynamic"` 필수 (searchParams 매 요청 반영)

## 개선 필요 사항

> 출처: `요구사항/frontend-improvements.md` (기준일 2026-04-27)

### 🔴 즉시 수정

| # | 항목 | 현황 | 비고 |
|---|------|------|------|
| 1 | **Vinted 플랫폼 필터 추가** | `MVP_PLATFORMS`에 vinted 빠짐 | `constants.ts` MVP_PLATFORMS에 추가 |
| 2 | **플랫폼 뱃지 고유 색상** | 현재 옅은 bg 색 사용 | 번개 #FF6B2C / 당근 #1DBE6B / 중고나라 #3478F6 / Vinted #7B61FF |
| 3 | **정렬 드롭다운 위치 이동** | 필터 행 우측 끝에 고립 | `총 N개` 텍스트 같은 줄 우측으로 이동 (`ProductList` 내부) |

### 🟡 이번 스프린트

| # | 항목 | 현황 | API |
|---|------|------|-----|
| 4 | **플랫폼별 최저가 비교 배너** | 미구현 | `GET /api/compare?q=` |
| 5 | **카드 가격 알림 버튼** | 미구현 | `POST /api/alerts` (Bearer 필요) |
| 6 | **토큰 자동 갱신 (401 처리)** | `authRefresh` 함수만 있음, 호출 안 됨 | `POST /api/auth/refresh` |
| 7 | **닉네임 필드 제거** | 폼에 있으나 API 미지원 | A안: 폼에서 제거 권장 |
| 8 | **소셜 로그인 "준비중" 처리** | 클릭 시 실제 리다이렉트 시도 (404) | 백엔드 OAuth 미구현 → 버튼 disabled 처리 |

### 🟢 나중에

| # | 항목 | 비고 |
|---|------|------|
| 9 | **스켈레톤 UI 보완** | `SkeletonGrid` 있으나 이미지 onError fallback 없음 |
| 10 | **이미지 Fallback** | `ProductCard`에 onError → 기본 이미지 처리 필요 |
| 11 | **가격 이력 차트 모달** | 카드 클릭 → 외부링크 대신 모달 + 차트, `GET /api/products/{id}/price-history` |

---

### 구현 메모

**플랫폼 비교 배너 응답 구조** (`GET /api/compare?q=키워드`):
```json
{
  "groups": [{
    "platforms": {
      "bungae":      { "min_price": 25000, "count": 134 },
      "danggeun":    { "min_price": 18000, "count": 89 },
      "joonggonara": { "min_price": 30000, "count": 210 }
    }
  }]
}
```

**가격 알림 요청** (`POST /api/alerts`, Bearer 필수):
```json
{ "keyword": "나이키", "target_price": 20000 }
```

**토큰 만료**: access_token 30분 / refresh_token 7일

## 디자인 규칙

- **흑백 기반**: 배경은 흰색(`white`/`gray-50`), 텍스트는 검정(`gray-900`)/회색(`gray-500`~`gray-700`). 다크모드도 동일하게 무채색 기반.
- **그라데이션 금지**: `bg-gradient-*`, `from-*`, `to-*`, `via-*` 등 그라데이션 클래스 사용 금지.
- **컬러 최소화**: 색상 사용은 플랫폼 뱃지(`PLATFORM_META`의 고유색)와 인터랙션 피드백(에러 `red`, 성공 `green`)에만 한정. 장식용 색상(`blue-50`, `blue-500` 배경·보더 등) 사용 금지.
- **AI 스러운 디자인 금지**: 글로우, 네온, 그라데이션 텍스트, 반짝이 애니메이션, 보라/파랑 계열 장식 효과 일체 사용 금지.
- **보더·구분선**: `border-gray-200` / `dark:border-gray-700` 등 무채색 보더로 영역 구분.
- **활성 상태 표시**: 선택·활성 상태는 `bg-gray-900 text-white` (다크: `bg-white text-gray-900`) 또는 `font-bold` + 밑줄 등 무채색 시각 변화로 표현. 파란색 하이라이트 대신 흑백 대비 사용.
- **버튼·칩**: `border-gray-300 text-gray-700` 기본, 활성 시 `bg-gray-900 text-white`. rounded-full 유지.
