import { test as base } from "@playwright/test";
import { TweetFixture } from "@/../test/fixtures/tweet";

const test = base.extend<{ t: TweetFixture }>({
  t: async ({ page, baseURL }, use) => {
    const t = new TweetFixture({
      page,
      baseURL: baseURL as string,
      repo: "TEST",
      contribution: "tweet",
    });
    await t.goto();
    await use(t);
    await t.screenshot("completed");
  },
});

test("tweet basic submission", async ({ page, t }) => {
  const text = "This is my test tweet!";
  await t.fillText(text);
  await t.screenshot("text-inputted");
  await t.submit({ text });
});

test("tweet without text", async ({ page, t }) => {
  await t.cannotSubmit(["Required unless retweeting or uploading images"]);
});
