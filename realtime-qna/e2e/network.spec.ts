import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("네트워크 중단 시나리오", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto("/login");
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /로그인/i }).click();
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("오프라인 상태에서 질문 작성 시도", async ({ page, context }) => {
    // 네트워크 오프라인으로 설정
    await context.setOffline(true);

    // 질문 작성 시도
    const questionText = "오프라인 테스트 질문";
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 에러 메시지 또는 토스트 확인
    await expect(
      page.getByText(/실패/i).or(page.getByText(/에러/i))
    ).toBeVisible({ timeout: 10000 });

    // 네트워크 복구
    await context.setOffline(false);
  });

  test("느린 네트워크에서 질문 작성", async ({ page, context }) => {
    // 느린 네트워크 시뮬레이션
    await context.route("**/*", (route) => {
      setTimeout(() => route.continue(), 2000); // 2초 지연
    });

    // 질문 작성
    const questionText = "느린 네트워크 테스트 질문";
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 로딩 상태 확인
    await expect(
      page.getByText(/작성 중/i).or(page.getByRole("button", { name: /작성 중/i }))
    ).toBeVisible();

    // 성공 메시지 확인 (더 긴 타임아웃)
    await expect(
      page.getByText(/질문이 성공적으로 작성되었습니다/i)
    ).toBeVisible({ timeout: 15000 });
  });
});

