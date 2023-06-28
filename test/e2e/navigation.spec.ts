import { test, expect } from "@playwright/test";
import { buildConfig } from "@/lib/config";
import testConfig from "@/../test/configs/test.config";

test("landing page and contribution list", async ({ page }) => {
  const { repos } = await buildConfig(testConfig);
  await page.goto("/");
  await expect(page).toHaveTitle("E2E C11R");
  await expect(page.getByText("E2E C11R")).toBeVisible();
  await page.getByText("Contribute").click();
  await expect(page.getByText("Select a Contribution Type")).toBeVisible();

  let first: any;
  for (const repo of Object.values(repos)) {
    const r = page.getByText(repo.title, { exact: true }).locator("..");
    await expect(r).toContainText(repo.description);
    await expect(r).toContainText(repo.githubUrl);
    for (const name of Object.keys(repo.contributions)) {
      const contribution = { ...repo.contributions[name], name };
      // hidden contributions should not be listed
      if (contribution.hidden) {
        await expect(r).not.toContainText(contribution.title);
      } else {
        if (!first) {
          first = { repo, contribution };
        }
        const c = r
          .getByText(contribution.title, { exact: true })
          .locator("..");
        await expect(c).toContainText(contribution.description);
      }
    }
  }
  // test that the first link navigates properly
  expect(first).toBeDefined();
  await page
    .getByText(first.contribution.title, { exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(
    `/contribute/${first.repo.name}/${first.contribution.name}`
  );
});
