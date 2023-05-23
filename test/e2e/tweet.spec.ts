import { TestInfo, expect, test } from "@playwright/test";

// todo make this configurable?
const path = "/contribute/TEST/tweet";
const prUrl = "https://github.com/test-pr-url";

test("tweet UI submits basic tweets", async ({ page, baseURL }) => {
  const submitRoute = `${baseURL}${path}/submit`;
  await page.route(submitRoute, async (route) => {
    const body = await route.request().postData();
    expect(body).toEqual(
      '{"quoteUrl":"","text":"This is my test tweet!","media":["","","",""],"alt_text_media":["","","",""],"authorization":"anon","repo":"TEST","contribution":"tweet","customMessage":"","customName":""}'
    );
    await route.fulfill({ json: { prUrl } });
  });
  await page.goto(path);
  await expect(page).toHaveScreenshot("basic-1.png", { fullPage: true });
  await page
    .getByPlaceholder("e.g. This is my tweet!")
    .fill("This is my test tweet!");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Create Pull Request" }).click();
  await page.getByRole("link", { name: prUrl }).isVisible();
  await expect(page).toHaveScreenshot("basic-2.png", { fullPage: true });
});
