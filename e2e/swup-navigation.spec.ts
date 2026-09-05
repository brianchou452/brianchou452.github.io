import { expect, test, type Page } from "@playwright/test";
import { fakeWork, installFakeWorkRoutes } from "./fixtures/fake-work";

async function waitForSwup(page: Page) {
  await expect(page.locator("html")).toHaveClass(/swup-enabled/);
}

async function waitForTransition(page: Page) {
  await expect(page.locator("html")).not.toHaveClass(/is-changing/);
}

async function goToWorksWithProgress(page: Page, lang = "zh-tw") {
  const worksLink = page.locator(`nav .menu a[href="/${lang}/works"]`);
  await worksLink.focus();
  await page.keyboard.press("Enter");

  await expect(page.locator(".swup-progress-bar")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/${lang}/works/?$`));
  await waitForTransition(page);
}

test.beforeEach(async ({ page }) => {
  await installFakeWorkRoutes(page);
});

test("Swup 進度條與假作品卡片在重複導覽後仍可使用", async ({ page }) => {
  await page.goto("/zh-tw/");
  await waitForSwup(page);

  await goToWorksWithProgress(page);
  const fakeCard = page.locator(`.work-item[data-work-id="${fakeWork.id}"]`);
  await expect(fakeCard.locator(".work-title")).toHaveText(fakeWork.title);
  await fakeCard.click({ force: true });

  await expect(page).toHaveURL(new RegExp(`/zh-tw/works/${fakeWork.id}/?$`));
  await expect(page.locator('[data-e2e-fixture="fake-work"] h1')).toHaveText(
    fakeWork.title,
  );

  await page.locator("a.brand-lg").click();
  await expect(page).toHaveURL(/\/zh-tw\/?$/);
  await waitForTransition(page);
  await expect(page.locator("[data-typing-line]").first()).not.toBeEmpty();

  await goToWorksWithProgress(page);
  await fakeCard.click({ force: true });
  await expect(page).toHaveURL(new RegExp(`/zh-tw/works/${fakeWork.id}/?$`));
});

test("第二次回到首頁與作品頁後仍可切換語言", async ({ page }) => {
  await page.goto("/zh-tw/");
  await waitForSwup(page);

  await goToWorksWithProgress(page);
  const languageButton = page.locator("footer #language-button");
  await languageButton.scrollIntoViewIfNeeded();
  await languageButton.click();
  await expect(languageButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('footer a[data-lang="en"]')).toHaveAttribute(
    "data-no-swup",
    "",
  );

  await page.locator('footer a[data-lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/works\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("nav .menu")).toContainText("Works");

  await waitForSwup(page);
  await page.locator("a.brand-lg").click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await waitForTransition(page);
  await page.locator('nav .menu a[href="/en/works"]').click();
  await expect(page).toHaveURL(/\/en\/works\/?$/);
  await waitForTransition(page);

  const revisitedLanguageButton = page.locator("footer #language-button");
  await revisitedLanguageButton.scrollIntoViewIfNeeded();
  await revisitedLanguageButton.click();
  await expect(revisitedLanguageButton).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  await page.locator('footer a[data-lang="zh-tw"]').click();
  await expect(page).toHaveURL(/\/zh-tw\/works\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-tw");
  await expect(page.locator("nav .menu")).toContainText("作品");
});
