import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("투표 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto("/login");
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /로그인/i }).click();
    
    // 홈 페이지로 이동 확인
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("질문에 투표하기", async ({ page }) => {
    // 다른 사용자의 질문이 있는지 확인 (본인 질문에는 투표 불가)
    // 먼저 질문이 있는지 확인
    const questionCards = page.locator('[data-testid="question-card"]');
    const questionCount = await questionCards.count();

    if (questionCount > 0) {
      // 첫 번째 질문의 투표 버튼 찾기
      const firstQuestion = questionCards.first();
      const voteButton = firstQuestion
        .getByRole("button")
        .filter({
          has: page.locator("svg"), // ThumbsUp 아이콘 포함
        })
        .first();

      if (await voteButton.count() > 0) {
        // 투표 전 투표 수 확인
        const voteCountBefore = await voteButton.textContent();

        // 투표 버튼 클릭
        await voteButton.first().click();

        // 성공 토스트 확인
        await expect(
          page.getByText(/투표가 완료되었습니다/i)
        ).toBeVisible({ timeout: 10000 });

        // 투표 수가 증가했는지 확인 (실시간 업데이트)
        await expect(voteButton).not.toHaveText(voteCountBefore || "0", {
          timeout: 5000,
        });
      }
    }
  });

  test("투표 취소", async ({ page }) => {
    // 먼저 투표한 질문이 있는지 확인
    // 투표 버튼이 활성화된 상태(투표한 상태)인 질문 찾기
    const questionCards = page.locator('[data-testid="question-card"]');
    const questionCount = await questionCards.count();

    if (questionCount > 0) {
      // 투표한 질문의 투표 버튼 찾기 (활성화된 상태)
      const firstQuestion = questionCards.first();
      const voteButton = firstQuestion
        .getByRole("button")
        .filter({ has: page.locator("svg") });

      if (await voteButton.count() > 0) {
        // 투표 버튼이 활성화된 상태인지 확인 (투표한 상태)
        const buttonClass = await voteButton.first().getAttribute("class");
        
        if (buttonClass?.includes("default") || buttonClass?.includes("bg-primary")) {
          // 투표 취소
          await voteButton.first().click();

          // 성공 토스트 확인
          await expect(
            page.getByText(/투표가 취소되었습니다/i)
          ).toBeVisible({ timeout: 10000 });
        }
      }
    }
  });

  test("본인 질문에는 투표 불가", async ({ page }) => {
    // 본인 질문 생성
    const questionText = `본인 질문입니다. ${Date.now()}`;
    await page
      .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
      .fill(questionText);
    await page.getByRole("button", { name: /질문 올리기/i }).click();

    // 질문이 표시될 때까지 대기
    await expect(page.getByText(questionText)).toBeVisible({ timeout: 10000 });

    // 본인 질문에는 투표 버튼이 비활성화되어 있거나 표시되지 않아야 함
    const questionCard = page
      .getByTestId("question-card")
      .filter({ hasText: questionText })
      .first();
    const voteButton = questionCard.getByRole("button").filter({
      has: page.locator("svg"),
    });

    // 투표 버튼이 비활성화되어 있거나 클릭할 수 없어야 함
    if (await voteButton.count() > 0) {
      await expect(voteButton.first()).toBeDisabled();
    }
  });
});

