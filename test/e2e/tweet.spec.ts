import { test as base } from "@playwright/test";
import { TweetFixture } from "@/../test/fixtures/tweet.fixture";

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
const JPEG_NAME = "kitten.jpg";
const JPEG_ALT = "A cute kitten";
const JPEG_BASE64 = "data:image/jpeg;base64";
const PNG_NAME = "dice.png";
const PNG_ALT = "Translucent dice";
const PNG_BASE64 = "data:image/png;base64";

test("tweet text", async ({ t }) => {
  await t.screenshot("required-text");
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.setText(TWEET_TEXT);
  await t.submit({ text: TWEET_TEXT });
  await t.screenshot("submitted");
});

test("tweet image", async ({ t }) => {
  await t.screenshot("required-image");
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.uploadMedia(JPEG_NAME);
  await t.screenshot("uploaded-image");
  await t.confirmCrop();
  await t.submit({
    media: [JPEG_BASE64],
  });
});

test("tweet image png", async ({ t }) => {
  await t.uploadAndCrop("dice.png");
  await t.submit({
    media: [PNG_BASE64],
  });
});

test("tweet image with description", async ({ t }) => {
  await t.uploadAndCrop(JPEG_NAME, JPEG_ALT);
  await t.submit({
    media: [JPEG_BASE64],
    alt_text_media: [JPEG_ALT],
  });
});

test("tweet image multiple", async ({ t }) => {
  await t.uploadAndCrop(JPEG_NAME);
  await t.uploadAndCrop(PNG_NAME);
  await t.screenshot("calculate-filesize");
  await t.uploadAndCrop(JPEG_NAME, JPEG_ALT);
  await t.uploadAndCrop(PNG_NAME, PNG_ALT);
  await t.submit({
    media: [JPEG_BASE64, PNG_BASE64, JPEG_BASE64, PNG_BASE64],
    alt_text_media: [null, null, JPEG_ALT, PNG_ALT],
  });
});

test("tweet retweet basic", async ({ t }) => {
  await t.setQuote("Retweet");
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
  await t.setQuote("Reply");
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
