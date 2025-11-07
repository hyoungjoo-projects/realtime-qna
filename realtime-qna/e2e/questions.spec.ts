import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("질문 CRUD 플로우", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto("/login");
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /로그인/i }).click();
    
    // 홈 페이지로 이동 확인
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("질문 생성", async ({ page }) => {
    // 질문 작성 폼 확인
    await expect(page.getByText(/새 질문 작성/i)).toBeVisible();

    // 질문 내용 입력
    const questionText = "E2E 테스트 질문입니다. 이것은 테스트용 질문입니다.";
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);

    // 질문 올리기 버튼 클릭
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 성공 토스트 확인
    await expect(
      page.getByText(/질문이 성공적으로 작성되었습니다/i)
    ).toBeVisible({ timeout: 10000 });

    // 질문 목록에 새 질문이 표시되는지 확인
    await expect(page.getByText(questionText)).toBeVisible({ timeout: 5000 });
  });

  test("질문 수정", async ({ page }) => {
    // 먼저 질문 생성
    const originalText = `수정할 질문입니다. ${Date.now()}`;
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(originalText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();
    
    // 질문이 표시될 때까지 대기
    await expect(page.getByText(originalText)).toBeVisible({ timeout: 10000 });

    // 수정 버튼 클릭 (본인 질문에만 표시됨)
    const questionCard = page
      .getByTestId("question-card")
      .filter({ hasText: originalText })
      .first();
    await questionCard.getByRole("button", { name: /수정/i }).click();

    // 수정 다이얼로그 확인
    await expect(page.getByRole("heading", { name: /질문 수정/i })).toBeVisible();

    // 질문 내용 수정
    const updatedText = "수정된 질문 내용입니다.";
    await page.getByPlaceholder(/질문을 입력하세요/i).fill(updatedText);

    // 수정 버튼 클릭
    await page.getByRole("button", { name: /수정$/i }).click();

    // 성공 토스트 확인
    await expect(
      page.getByText(/질문이 성공적으로 수정되었습니다/i)
    ).toBeVisible({ timeout: 10000 });

    // 수정된 질문이 표시되는지 확인
    await expect(page.getByText(updatedText)).toBeVisible({ timeout: 5000 });
  });

  test("질문 삭제", async ({ page }) => {
    // 먼저 질문 생성
    const questionText = `삭제할 질문입니다. ${Date.now()}`;
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();
    
    // 질문이 표시될 때까지 대기
    await expect(page.getByText(questionText)).toBeVisible({ timeout: 10000 });

    // 삭제 버튼 클릭
    const questionCard = page
      .getByTestId("question-card")
      .filter({ hasText: questionText })
      .first();
    await questionCard.getByRole("button", { name: /삭제/i }).click();

    // 삭제 확인 다이얼로그 확인
    await expect(
      page.getByRole("heading", { name: /질문 삭제/i })
    ).toBeVisible();

    // 삭제 확인 버튼 클릭
    await page.getByRole("button", { name: /삭제$/i }).click();

    // 성공 토스트 확인
    await expect(page.getByText(/질문이 삭제되었습니다/i)).toBeVisible({
      timeout: 10000,
    });

    // 질문이 목록에서 제거되었는지 확인
    await expect(page.getByText(questionText)).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("질문 목록 표시", async ({ page }) => {
    // 질문 목록 섹션 확인
    await expect(page.getByText(/질문 목록/i)).toBeVisible();
  });

  test("빈 질문 작성 시도 (검증)", async ({ page }) => {
    // 질문 내용 없이 제출 시도
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 검증 에러 메시지 확인
    await expect(
      page.getByText(/질문 내용을 입력해주세요/i)
    ).toBeVisible();
  });
});

