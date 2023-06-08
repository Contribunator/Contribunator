import config from "@/lib/config";
import { expect, test as base } from "@playwright/test";
import { PageFixture } from "@/../test/fixtures/page.fixture";

const test = base.extend<{ p: PageFixture }>({
  p: async ({ page, headless }, use) => {
    const p = new PageFixture({ page, headless, path: "/contribute" });
    await p.goto();
    await use(p);
  },
});

test("contributions list", async ({ p, page }) => {
  await p.hasTitle(config.title);
  // TODO use a fixture, and check for various other configs
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
    // todo check for contribution types
  }
  await p.screenshot();
});

// TODO test get files, test when file does not exist
