# 실시간 Q&A 플랫폼 PRD 요약본

## 제품 개요
Slido와 유사한 실시간 질문/투표 플랫폼. 행사, 강의, 회의에서 청중의 질문을 수집하고 인기 투표로 우선순위를 정하는 서비스.

**핵심 가치:** 민주적이고 조직적인 Q&A 경험 제공, 조용한 참가자도 참여 가능, 인기있는 질문 자동 부각

## 핵심 기능

1. **사용자 인증 (Supabase Auth)** - 이메일/비밀번호 기반 회원가입 및 로그인
   - Supabase Auth 내장 기능 활용
   - JWT 토큰 기반 세션 관리
   - 자동 이메일 인증 (선택적)
   - 비밀번호 재설정 기능
   - Row Level Security와 자동 연동

2. **실시간 질문 관리** - 질문 작성, 수정, 삭제 (본인 질문만)
   - **Supabase Realtime을 통한 즉시 반영**
     - PostgreSQL의 LISTEN/NOTIFY 기반 WebSocket 연결
     - INSERT/UPDATE/DELETE 이벤트 실시간 브로드캐스트
     - 모든 연결된 클라이언트에 자동 동기화
     - 네트워크 재연결 시 자동 복구
   - **단일 세션 구조 (MVP)**
     - 모든 사용자가 하나의 글로벌 질문 목록 공유
     - 세션/이벤트 분리 없이 단순한 구조
     - 추후 Phase 10에서 다중 세션 기능 추가 예정
   - 낙관적 UI 업데이트 (즉시 반영 후 서버 확인)
   - 본인 질문에만 수정/삭제 버튼 표시

3. **질문 투표 시스템** - 다른 사람 질문에 추천, 실시간 투표수 업데이트
   - Supabase Realtime으로 투표수 즉시 반영
   
4. **반응형 디자인** - 모바일, 태블릿, 데스크톱 완벽 대응
   - **shadcn/ui 컴포넌트 시스템 활용**
     - Radix UI 기반 접근성 보장
     - 커스터마이징 가능한 컴포넌트 라이브러리
     - Card, Button, Input, Dialog, Toast 등 활용
     - 일관된 디자인 시스템 구축
   - **tweakcn을 통한 디자인 토큰 관리**
     - 색상 팔레트 통합 관리
     - 다크/라이트 모드 지원 (선택적)
     - 브랜드 커스터마이징 용이
   - **Tailwind CSS 반응형 유틸리티**
     - Mobile-first 접근 방식
     - Breakpoint 기반 레이아웃 (`sm:`, `md:`, `lg:`, `xl:`)
     - Flexbox 및 Grid 시스템 활용
     - 터치 최적화 인터랙션
   - **디바이스별 최적화**
     - 모바일 (< 640px): 단일 컬럼, 큰 터치 타겟, 하단 네비게이션
     - 태블릿 (640px ~ 1024px): 2단 레이아웃, 사이드바 토글
     - 데스크톱 (> 1024px): 다단 레이아웃, 고정 사이드바, 넓은 여백

## 기술 스택

### Frontend
* **React** (v18+) - UI 컴포넌트 라이브러리
* **TypeScript** (v5+) - 타입 안정성 및 개발자 경험 향상
* **Vite** - 빠른 개발 서버 및 빌드 도구
* **React Router** (v6+) - 클라이언트 사이드 라우팅 및 Protected Routes

### 상태 관리 & 데이터 페칭
* **TanStack Query (React Query)** (v5+) - 서버 상태 관리 및 데이터 페칭
  * 자동 캐싱 및 백그라운드 동기화
  * 낙관적 업데이트 지원
  * 자동 리페칭 및 데이터 무효화
  * 로딩/에러 상태 자동 관리
  * Supabase Realtime과 통합
  * Devtools로 쿼리 상태 디버깅
* **React Hook Form** (v7+) - 폼 상태 관리 및 유효성 검사
  * 비제어 컴포넌트 기반 고성능
  * Zod 스키마와 통합한 타입 안전 검증
  * shadcn/ui Form 컴포넌트와 완벽 통합
  * 에러 메시지 자동 처리
  * 폼 리셋 및 기본값 관리

### 폼 검증
* **Zod** (v3+) - TypeScript 기반 스키마 검증
  * React Hook Form과 통합 (@hookform/resolvers)
  * 런타임 타입 검증
  * 자동 TypeScript 타입 추론
  * 커스텀 에러 메시지

### UI/Styling
* **Tailwind CSS** (v3+) - 유틸리티 기반 CSS 프레임워크
* **shadcn/ui** - 재사용 가능한 React 컴포넌트 라이브러리
  * Card, Button, Input, Textarea
  * Dialog, Sheet, AlertDialog
  * Toast, Badge, Avatar
  * Skeleton, Separator
  * **Form** (React Hook Form 통합)
* **tweakcn** - 디자인 토큰 및 테마 관리
* **Radix UI** - 접근성 있는 UI 프리미티브 (shadcn/ui 기반)
* **Lucide React** - 아이콘 라이브러리
* **class-variance-authority (cva)** - 조건부 스타일링
* **clsx** / **tailwind-merge** - 클래스 병합 유틸리티

### Backend (BaaS)
* **Supabase** - Backend-as-a-Service 플랫폼
  * **PostgreSQL** (v15+) - 관계형 데이터베이스
  * **Supabase Auth** - 이메일/비밀번호 인증, JWT 토큰 관리
  * **Supabase Realtime** - WebSocket 기반 실시간 데이터 동기화
  * **Row Level Security (RLS)** - 데이터베이스 레벨 권한 제어
  * **RESTful API** - 자동 생성 데이터베이스 API
  * **@supabase/supabase-js** - JavaScript SDK

### 배포 및 호스팅
* **Vercel** - Frontend 호스팅 및 CI/CD
  * 자동 배포 파이프라인
  * Preview 배포 (PR별)
  * Edge Network CDN
  * 환경변수 관리

### 테스팅
* **Playwright** - E2E 테스팅 프레임워크
  * 크로스 브라우저 테스트 (Chromium, Firefox, WebKit)
  * 모바일/태블릿 뷰포트 테스트
  * 실시간 동기화 테스트
  * 멀티 유저 시나리오 테스트
* **Vitest** (선택적, 추후) - 단위 및 통합 테스트

### 모니터링 및 에러 추적
* **Sentry** - 실시간 에러 추적 및 성능 모니터링
  * React Error Boundary 통합
  * Performance Monitoring
  * Breadcrumb 추적
  * Source Map 업로드
  * 알림 설정 (이메일/Slack)

### 개발 도구
* **ESLint** - JavaScript/TypeScript 린팅
* **Prettier** - 코드 포매팅
* **PostCSS** - CSS 처리 (Tailwind CSS 필수)
* **Autoprefixer** - 브라우저 호환성 CSS 접두사 자동 추가
* **Git** - 버전 관리
* **GitHub** - 코드 저장소 및 CI/CD 트리거
* **npm** / **pnpm** - 패키지 관리

### MCP 도구 (개발 가속화)
* **context7 MCP** - 코드베이스 컨텍스트 관리 및 파일 탐색
* **supabase MCP** - DB 스키마 자동 생성 및 API 관리
* **21 dev MCP** - UI 컴포넌트 생성 및 프로토타이핑
* **Playwright MCP** - E2E 테스트 스크립트 자동 생성
* **Sentry MCP** - 에러 추적 설정 및 관리
* **Vercel MCP** - 배포 자동화 및 관리

### 환경 및 의존성
* **Node.js** (v18+) - JavaScript 런타임
* **npm** / **pnpm** - 패키지 매니저
