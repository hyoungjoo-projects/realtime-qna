import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("반응형 디자인 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto("/login");
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /로그인/i }).click();
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("모바일 뷰포트 (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 모바일 레이아웃 확인
    await expect(page.getByText(/실시간 Q&A/i)).toBeVisible();

    // 질문 작성 폼이 모바일에서도 접근 가능한지 확인
    await expect(
      page.getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
    ).toBeVisible();

    // 버튼이 터치하기 적절한 크기인지 확인 (최소 44px)
    const submitButton = page.getByRole("button", { name: /질문 올리기/i });
    const buttonBox = await submitButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
  });

  test("태블릿 뷰포트 (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // 태블릿 레이아웃 확인
    await expect(page.getByText(/실시간 Q&A/i)).toBeVisible();

    // 질문 작성 폼 확인
    await expect(
      page.getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
    ).toBeVisible();
  });

  test("데스크톱 뷰포트 (1920x1080)", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 데스크톱 레이아웃 확인
    await expect(page.getByText(/실시간 Q&A/i)).toBeVisible();

    // 질문 작성 폼 확인
    await expect(
      page.getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
    ).toBeVisible();
  });

  test("로그인 페이지 모바일 반응형", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    // 로그인 폼이 모바일에서도 잘 보이는지 확인
    await expect(page.getByRole("heading", { name: /로그인/i })).toBeVisible();

    // 입력 필드가 터치하기 적절한 크기인지 확인
    const emailInput = page.getByLabel(/이메일/i);
    const inputBox = await emailInput.boundingBox();
    expect(inputBox?.height).toBeGreaterThanOrEqual(44);
  });

  test("질문 카드 모바일 레이아웃", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // 질문 생성
    const questionText = "모바일 테스트 질문";
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 질문이 모바일에서도 잘 표시되는지 확인
    await expect(page.getByText(questionText)).toBeVisible({
      timeout: 10000,
    });
  });
});

