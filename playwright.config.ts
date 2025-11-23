import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* 테스트 실행 시 최대 시간 (30초) */
  timeout: 30 * 1000,
  expect: {
    /* expect 단언문의 타임아웃 (5초) */
    timeout: 5000,
  },
  /* 테스트를 병렬로 실행 */
  fullyParallel: true,
  /* CI에서 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,
  /* CI에서 병렬 실행 수 제한 */
  workers: process.env.CI ? 1 : undefined,
  /* 리포트 설정 */
  reporter: "html",
  /* 공유 설정 */
  use: {
    /* 기본 타임아웃 (30초) */
    actionTimeout: 15 * 1000,
    /* 네비게이션 타임아웃 (30초) */
    navigationTimeout: 30 * 1000,
    /* 스크린샷 촬영 */
    screenshot: "only-on-failure",
    /* 비디오 녹화 */
    video: "retain-on-failure",
    /* 트레이스 수집 */
    trace: "retain-on-failure",
    /* 기본 URL */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:5173",
  },

  /* 테스트할 프로젝트들 (브라우저별) */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    /* 모바일 테스트 */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    /* 태블릿 테스트 */
    {
      name: "Tablet",
      use: { ...devices["iPad Pro"] },
    },
  ],

  /* 개발 서버 설정 */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

