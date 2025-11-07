import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("인증 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("로그인 페이지로 리다이렉트", async ({ page }) => {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트되어야 함
    await expect(page).toHaveURL(/.*login/);
  });

  test("회원가입 플로우", async ({ page }) => {
    await page.goto("/signup");

    // 회원가입 폼 확인
    await expect(page.getByRole("heading", { name: /회원가입/i })).toBeVisible();

    // 이메일 입력
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    
    // 비밀번호 입력
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    
    // 비밀번호 확인 입력
    await page.getByLabel(/비밀번호 확인/i).fill(TEST_PASSWORD);

    // 회원가입 버튼 클릭
    await page.getByRole("button", { name: /회원가입/i }).click();

    // 성공 메시지 또는 토스트 확인
    await expect(
      page.getByText(/회원가입이 완료되었습니다/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("로그인 플로우", async ({ page }) => {
    await page.goto("/login");

    // 로그인 폼 확인
    await expect(page.getByRole("heading", { name: /로그인/i })).toBeVisible();

    // 이메일 입력
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    
    // 비밀번호 입력
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);

    // 로그인 버튼 클릭
    await page.getByRole("button", { name: /로그인/i }).click();

    // 홈 페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/", { timeout: 10000 });
    
    // 홈 페이지 요소 확인
    await expect(page.getByText(/실시간 Q&A/i)).toBeVisible();
  });

  test("로그아웃 플로우", async ({ page }) => {
    // 먼저 로그인
    await page.goto("/login");
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /로그인/i }).click();
    
    // 홈 페이지로 이동 확인
    await expect(page).toHaveURL("/", { timeout: 10000 });

    // 로그아웃 버튼 클릭
    await page.getByRole("button", { name: /로그아웃/i }).click();

    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
  });

  test("비밀번호 재설정 플로우", async ({ page }) => {
    await page.goto("/forgot-password");

    // 비밀번호 재설정 폼 확인
    await expect(
      page.getByRole("heading", { name: /비밀번호 재설정/i })
    ).toBeVisible();

    // 이메일 입력
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);

    // 재설정 링크 보내기 버튼 클릭
    await page
      .getByRole("button", { name: /재설정 링크 보내기/i })
      .click();

    // 성공 메시지 확인
    await expect(
      page.getByText(/비밀번호 재설정 링크가 이메일로 전송되었습니다/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("로그인 페이지에서 회원가입으로 이동", async ({ page }) => {
    await page.goto("/login");

    // 회원가입 링크 클릭
    await page.getByRole("button", { name: /회원가입/i }).click();

    // 회원가입 페이지로 이동 확인
    await expect(page).toHaveURL(/.*signup/);
  });

  test("회원가입 페이지에서 로그인으로 이동", async ({ page }) => {
    await page.goto("/signup");

    // 로그인 링크 클릭
    await page.getByRole("button", { name: /로그인/i }).click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL(/.*login/);
  });
});

