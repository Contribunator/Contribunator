import config from "@/util/config";
import { expect, test as t } from "@playwright/test";
import { PageFixture } from "@/../test/fixtures/page";

const test = t.extend<{ p: PageFixture }>({
  p: async ({ page, headless }, use) => {
    const p = new PageFixture({ page, headless, path: "/contribute" });
    await p.goto();
    await use(p);
  },
});

test("contributions list", async ({ p, page }) => {
  await p.hasTitle(config.title);
  for (const repo of Object.values(config.repos)) {
    const repoLocator = await page
      .getByRole("heading", { name: repo.name })
      .locator("..");
    await expect(repoLocator).toBeVisible();
    // it should cotnain description, url and list of contributions
    await expect(repoLocator).toContainText(repo.description);
    await expect(repoLocator).toContainText(
      `https://github.com/${config.owner}/${repo.name}`
    );
    // todo etc.
  }
  await p.screenshot();
});
