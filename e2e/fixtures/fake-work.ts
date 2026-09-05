import type { Page, Route } from "@playwright/test";

export const fakeWork = {
  id: "e2e-fake-work",
  title: "E2E 假作品",
} as const;

const fixtureSourceWorkId = "1c48ba51";

async function fulfillWorksIndex(route: Route) {
  const response = await route.fetch();
  let body = await response.text();

  body = body
    .replace(
      /class="work-item" data-work-id="[^"]+"/,
      `class="work-item" data-work-id="${fakeWork.id}"`,
    )
    .replace(
      /<span class="work-title"([^>]*)>[^<]+/,
      `<span class="work-title"$1>${fakeWork.title}`,
    );

  await new Promise((resolve) => setTimeout(resolve, 700));
  await route.fulfill({
    response,
    body,
    headers: {
      ...response.headers(),
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
    },
  });
}

export async function installFakeWorkRoutes(page: Page) {
  await page.route("**/zh-tw/works**", async (route) => {
    const pathname = new URL(route.request().url()).pathname.replace(/\/$/, "");

    if (pathname === `/zh-tw/works/${fakeWork.id}`) {
      const fixtureUrl = route
        .request()
        .url()
        .replace(fakeWork.id, fixtureSourceWorkId);
      const response = await route.fetch({ url: fixtureUrl });
      const body = (await response.text())
        .replace("<main class=", '<main data-e2e-fixture="fake-work" class=')
        .replace(/<h1([^>]*)>.*?<\/h1>/, `<h1$1>${fakeWork.title}</h1>`);

      await route.fulfill({ response, body });
      return;
    }

    if (pathname === "/zh-tw/works") {
      await fulfillWorksIndex(route);
      return;
    }

    await route.continue();
  });
}
