import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "testpassword123";

test.describe("실시간 동기화", () => {
  test("다중 사용자 시나리오 - 질문 생성 실시간 동기화", async ({
    browser,
  }) => {
    // 두 개의 브라우저 컨텍스트 생성 (다중 사용자 시뮬레이션)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // 두 사용자 모두 로그인
      for (const page of [page1, page2]) {
        await page.goto("/login");
        await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
        await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
        await page.getByRole("button", { name: /로그인/i }).click();
        await expect(page).toHaveURL("/", { timeout: 10000 });
      }

      // 사용자 1이 질문 생성
      const questionText = `실시간 동기화 테스트 질문 ${Date.now()}`;
      await page1
        .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
        .fill(questionText);
      await page1.getByRole("button", { name: /질문 올리기/i }).click();

      // 사용자 2의 화면에 질문이 실시간으로 나타나는지 확인
      await expect(page2.getByText(questionText)).toBeVisible({
        timeout: 10000,
      });
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test("다중 사용자 시나리오 - 투표 실시간 동기화", async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // 두 사용자 모두 로그인
      for (const page of [page1, page2]) {
        await page.goto("/login");
        await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
        await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
        await page.getByRole("button", { name: /로그인/i }).click();
        await expect(page).toHaveURL("/", { timeout: 10000 });
      }

      // 사용자 1이 질문 생성
      const questionText = `투표 테스트 질문 ${Date.now()}`;
      await page1
        .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
        .fill(questionText);
      await page1.getByRole("button", { name: /질문 올리기/i }).click();

      // 질문이 두 사용자 모두에게 표시될 때까지 대기
      await expect(page1.getByText(questionText)).toBeVisible({
        timeout: 10000,
      });
      await expect(page2.getByText(questionText)).toBeVisible({
        timeout: 10000,
      });

      // 사용자 2가 투표
      const questionCard2 = page2
        .getByTestId("question-card")
        .filter({ hasText: questionText })
        .first();
      const voteButton2 = questionCard2
        .getByRole("button")
        .filter({ has: page2.locator("svg") })
        .first();

      if (await voteButton2.count() > 0 && !(await voteButton2.isDisabled())) {
        const voteCountBefore = await voteButton2.textContent();
        await voteButton2.click();

        // 사용자 1의 화면에서도 투표 수가 업데이트되는지 확인
        const questionCard1 = page1
          .getByTestId("question-card")
          .filter({ hasText: questionText })
          .first();
        const voteButton1 = questionCard1
          .getByRole("button")
          .filter({ has: page1.locator("svg") })
          .first();

        await expect(voteButton1).not.toHaveText(voteCountBefore || "0", {
          timeout: 10000,
        });
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test("질문 삭제 실시간 동기화", async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // 두 사용자 모두 로그인
      for (const page of [page1, page2]) {
        await page.goto("/login");
        await page.getByLabel(/이메일/i).fill(TEST_EMAIL);
        await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD);
        await page.getByRole("button", { name: /로그인/i }).click();
        await expect(page).toHaveURL("/", { timeout: 10000 });
      }

      // 사용자 1이 질문 생성
      const questionText = `삭제 테스트 질문 ${Date.now()}`;
      await page1
        .getByPlaceholder(/궁금한 점을 자유롭게 질문해보세요/i)
        .fill(questionText);
      await page1.getByRole("button", { name: /질문 올리기/i }).click();

      // 질문이 두 사용자 모두에게 표시될 때까지 대기
      await expect(page1.getByText(questionText)).toBeVisible({
        timeout: 10000,
      });
      await expect(page2.getByText(questionText)).toBeVisible({
        timeout: 10000,
      });

      // 사용자 1이 질문 삭제
      const questionCard1 = page1
        .getByTestId("question-card")
        .filter({ hasText: questionText })
        .first();
      await questionCard1.getByRole("button", { name: /삭제/i }).click();
      await page1.getByRole("button", { name: /삭제$/i }).click();

      // 사용자 2의 화면에서도 질문이 사라지는지 확인
      await expect(page2.getByText(questionText)).not.toBeVisible({
        timeout: 10000,
      });
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});

