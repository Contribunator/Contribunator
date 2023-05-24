import config from "@/util/config";
import { test as t } from "@playwright/test";
import { PageFixture } from "@/../test/fixtures/page";

const test = t.extend<{ p: PageFixture }>({
  p: async ({ page }, use) => {
    const p = new PageFixture(page, "/");
    await p.goto();
    await use(p);
  },
});

test("landing page", async ({ p }) => {
  await p.hasTitle(config.title);
  await p.hasText(config.title);
  await p.hasText(config.description);
  await p.screenshot();
});
