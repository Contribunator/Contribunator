import { test as base } from "@playwright/test";
import { PageFixture } from "@/../test/fixtures/page.fixture";

const test = base.extend<{ p: PageFixture }>({
  p: async ({ page, headless }, use) => {
    const p = new PageFixture({ page, headless, path: "/" });
    await p.goto();
    await use(p);
  },
});

test("landing page and contribution list", async ({ p }) => {
  await p.hasTitle("E2E C11R");
  // await p.hasText(config.title);
  // await p.hasText(config.description);
  // await p.page.getByText("Contribute").click();
  // TODO
});
