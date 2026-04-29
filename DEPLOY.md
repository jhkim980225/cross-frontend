# Vercel 배포 가이드 (GitHub 연동)

## 사전 준비

- GitHub 계정 (레포: `jhkim980225/cross-frontend`)
- Vercel 계정 (무료 Hobby 플랜 가능)

---

## 1단계: GitHub에 코드 push

```bash
# 현재 변경사항 확인
git status

# 변경된 파일 스테이징
git add .

# 커밋
git commit -m "feat: 카테고리 depth 구조 및 흑백 UI 적용"

# GitHub에 push
git push origin master
```

---

## 2단계: Vercel 가입 및 GitHub 연동

1. [vercel.com](https://vercel.com) 접속
2. **"Sign Up"** 클릭 → **"Continue with GitHub"** 선택
3. GitHub 로그인 → Vercel에 GitHub 접근 권한 허용

---

## 3단계: 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..." → "Project"** 클릭
2. **"Import Git Repository"** 에서 `cross-frontend` 레포 찾기
   - 레포가 안 보이면 **"Adjust GitHub App Permissions"** 클릭 → 레포 접근 허용
3. 레포 선택 후 **"Import"** 클릭

---

## 4단계: 프로젝트 설정

Import 화면에서 아래 항목 확인:

| 항목 | 값 |
|------|-----|
| **Framework Preset** | `Next.js` (자동 감지됨) |
| **Root Directory** | `./ ` (기본값 유지) |
| **Build Command** | `next build` (기본값 유지) |
| **Output Directory** | `.next` (기본값 유지) |

### 환경변수 설정

**"Environment Variables"** 섹션에 추가:

| Key | Value | 설명 |
|-----|-------|------|
| `BACKEND_URL` | (백엔드 배포 후 입력) | 예: `https://your-backend.fly.dev` |

> 백엔드 아직 없으면 비워두고 나중에 추가 가능

**"Deploy"** 클릭

---

## 5단계: 배포 확인

- 빌드 로그가 실시간으로 표시됨
- 성공 시 `https://cross-frontend-xxxxx.vercel.app` 같은 URL 생성
- 이 URL로 접속해서 프론트엔드 확인

---

## 6단계: 백엔드 배포 후 연결

백엔드 배포가 완료되면:

1. Vercel 대시보드 → 프로젝트 선택
2. **"Settings"** 탭 → **"Environment Variables"**
3. `BACKEND_URL` 추가 또는 수정
   - 예: `https://your-backend.railway.app`
4. **"Deployments"** 탭 → 최신 배포의 **"..."** → **"Redeploy"** 클릭
   (환경변수 변경은 재배포해야 적용됨)

---

## 이후 자동 배포

설정 완료 후에는:

- `git push origin master` 할 때마다 Vercel이 자동으로 빌드 + 배포
- PR을 올리면 Preview 배포도 자동 생성

---

## 커스텀 도메인 (선택)

1. **"Settings"** → **"Domains"**
2. 원하는 도메인 입력 (예: `cross.example.com`)
3. DNS 설정 안내에 따라 CNAME 또는 A 레코드 추가

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| 빌드 실패 | TypeScript/ESLint 오류 | 로컬에서 `npm run build` 로 먼저 확인 |
| API 호출 실패 | `BACKEND_URL` 미설정 | 환경변수 추가 후 Redeploy |
| 이미지 안 보임 | Next.js Image 도메인 설정 | `next.config.mjs`의 `remotePatterns` 확인 |
| 404 에러 | 라우팅 문제 | Vercel은 Next.js 라우팅 자동 처리, 설정 불필요 |
