import { test as base } from "@playwright/test";
import { TweetFixture } from "@/../test/fixtures/tweet";

const test = base.extend<{ t: TweetFixture }>({
  t: async ({ page, baseURL, headless }, use) => {
    const t = new TweetFixture({
      page,
      headless,
      baseURL,
      repo: "TEST",
      contribution: "tweet",
    });
    await t.goto();
    await use(t);
  },
});

const TWEET_TEXT = "This is my test tweet!";
const QUOTE_URL = "https://twitter.com/TEST/status/1234567890";
const TEXT_VALIDATION = "Required unless retweeting or uploading images";
const RETWEET_VALIDATION = "Required retweet URL";
const REPLY_VALIDATION = "Required reply URL";
const IFRAME_TEXT = `iFrame for preview of ${QUOTE_URL}`;

test("tweet text", async ({ t }) => {
  await t.screenshot("required-text");
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.setText(TWEET_TEXT);
  await t.submit({ text: TWEET_TEXT });
});

test("tweet retweet basic", async ({ t }) => {
  await t.setQuote("retweet");
  await t.cannotSubmit([RETWEET_VALIDATION]);
  await t.screenshot("required-quote-url");
  await t.setQuoteUrl(QUOTE_URL);
  await t.hasText(IFRAME_TEXT);
  await t.submit({
    quoteUrl: QUOTE_URL,
    quoteType: "retweet",
  });
});

test("tweet reply basic", async ({ t }) => {
  await t.setQuote("reply");
  await t.cannotSubmit([REPLY_VALIDATION, TEXT_VALIDATION]);
  await t.screenshot("required-quote-url");
  await t.setQuoteUrl(QUOTE_URL);
  await t.hasText(IFRAME_TEXT);
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.screenshot("required-text");
  await t.setText(TWEET_TEXT);
  await t.submit({
    quoteUrl: QUOTE_URL,
    text: TWEET_TEXT,
    quoteType: "reply",
  });
});
