import { test, expect } from "@playwright/test";
import config, { getRepo, getContribution } from "@/lib/config";

test("landing page and contribution list", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("E2E C11R");
  await expect(page.getByText("E2E C11R")).toBeVisible();
  await page.getByText("Contribute").click();
  await expect(page.getByText("Select a Contribution Type")).toBeVisible();

  // for ensure we list all contributions
  let first: any;
  for (const repoName of Object.keys(config.repos || {})) {
    const { repo } = getRepo(repoName);
    const r = page.getByText(repo.title, { exact: true }).locator("..");
    await expect(r).toContainText(repo.description);
    await expect(r).toContainText(repo.githubUrl);
    for (const contributionName of Object.keys(repo.contributions)) {
      const { contribution } = getContribution(repoName, contributionName);
      if (contribution.hidden) {
        // hidden contributions should not be listed
        await expect(r).not.toContainText(contribution.title);
      } else {
        first = first || {
          repo,
          contribution: { ...contribution, name: contributionName },
        };
        const c = r
          .getByText(contribution.title, { exact: true })
          .locator("..");
        await expect(c).toContainText(contribution.description);
      }
    }
  }
  // test the first link navigates properly
  expect(first).toBeDefined();
  await page
    .getByText(first.contribution.title, { exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(
    `/contribute/${first.repo.name}/${first.contribution.name}`
  );
});
