import config from "@/util/config";
import { test, expect } from "@playwright/test";

test("happy path", async ({ page }) => {
  await page.goto("/");
  expect(page).toHaveTitle(config.title);
  expect(page).toHaveScreenshot("landing.png");
  const title = page.locator("h1");
  expect(title).toHaveText(config.title);
  const description = page.locator("p");
  expect(description).toHaveText(config.description);
  await page.getByRole("link", { name: "Contribute" }).click();
  await expect(page).toHaveScreenshot("contributions.png");
  await page.getByRole("heading", { name: "Testing" }).click();
  await page
    .getByText(
      "Testinghttps://github.com/Contribunator/AnotherTest DescriptionTweetTweet about "
    )
    .click();
  await page
    .getByRole("link", { name: "Tweet Tweet about this project" })
    .click();
  await page.getByPlaceholder("e.g. I like turtles 🐢 #turtlepower").click();
  await page
    .getByPlaceholder("e.g. I like turtles 🐢 #turtlepower")
    .fill("This is my tweet");
  await expect(page).toHaveScreenshot("simple-tweet.png");
});
