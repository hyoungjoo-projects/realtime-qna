# 실시간 Q&A 애플리케이션

React + TypeScript + Vite로 구축된 실시간 질문과 답변 플랫폼입니다.

## 주요 기능

- 🔐 이메일/비밀번호 인증 (Supabase Auth)
- 💬 실시간 질문 작성, 수정, 삭제
- 👍 투표 시스템
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ⚡ 실시간 동기화 (Supabase Realtime)
- 🎨 현대적인 UI (shadcn/ui + Tailwind CSS)
- 🧪 E2E 테스트 (Playwright)

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **Testing**: Playwright (E2E)
- **Notifications**: Sonner

## 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 pnpm
- Supabase 프로젝트

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 Supabase URL과 Anon Key 추가
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### E2E 테스트

```bash
# 모든 테스트 실행
npm run test:e2e

# UI 모드로 실행
npm run test:e2e:ui

# 헤드 모드로 실행 (브라우저 표시)
npm run test:e2e:headed

# 디버그 모드
npm run test:e2e:debug
```

## E2E 테스트

Playwright를 사용하여 다음 시나리오를 테스트합니다:

- ✅ 인증 플로우 (로그인, 회원가입, 로그아웃, 비밀번호 재설정)
- ✅ 질문 CRUD (생성, 수정, 삭제)
- ✅ 투표 기능
- ✅ 실시간 동기화 (다중 사용자 시나리오)
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 네트워크 중단 시나리오

테스트는 Chromium, Firefox, WebKit 브라우저에서 실행됩니다.

## 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── auth/         # 인증 관련 컴포넌트
│   ├── questions/    # 질문 관련 컴포넌트
│   ├── routing/      # 라우팅 컴포넌트
│   └── ui/           # UI 컴포넌트 (shadcn/ui)
├── contexts/         # React Context
├── hooks/            # Custom Hooks
├── lib/              # 유틸리티 및 설정
├── pages/            # 페이지 컴포넌트
└── types/            # TypeScript 타입 정의

e2e/                  # Playwright E2E 테스트
```

## 라이선스

MIT
