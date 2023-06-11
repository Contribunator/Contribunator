import { test as base } from "@playwright/test";
import { TweetFixture } from "@/../test/fixtures/tweet.fixture";
import { TIME } from "test/fixtures/contribution.fixture";

// TODO refactor to DRY out media etc into fixutre

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
const IFRAME_TEXT = `iframe: https://twitframe.com/show?url=${encodeURIComponent(
  QUOTE_URL
)}`;
const JPEG_NAME = "kitten.jpg";
const JPEG_TYPE = "jpeg";
const JPEG_ALT = "A cute kitten";
const JPEG_BASE64 = "data:image/jpeg;base64";
const JPEG_CONVERTED = "4Ru4blQ6EbuG4V//2Q==";

const PNG_TYPE = "png";
const PNG_NAME = "dice.png";
const PNG_CONVERTED = "v5WoAAAAAElFTkSuQmCC";

const PNG_ALT = "Translucent dice";
const PNG_BASE64 = "data:image/png;base64";

test("tweet text", async ({ t }) => {
  await t.screenshot("required-text");
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.setText(TWEET_TEXT);
  const message = "Add tweet this is my test tweet";
  const branch = "add-tweet-this-is-my-test-tweet";
  await t.submit(
    { text: TWEET_TEXT },
    {
      branch,
      commit: {
        message,
        files: {
          [`tweets/${TIME}${branch}.tweet`]: TWEET_TEXT,
        },
      },
      pr: {
        title: message,
        body: "This Pull Request creates a new tweet.",
      },
    }
  );
  await t.screenshot("submitted");
});

test("tweet image", async ({ t }) => {
  await t.screenshot("required-image");
  await t.cannotSubmit([TEXT_VALIDATION]);
  await t.uploadMedia(JPEG_NAME);
  await t.screenshot("uploaded-image");
  await t.confirmCrop();
  const message = "Add tweet with media";
  const branch = "add-tweet-with-media";
  await t.submit(
    {
      media: [{ data: JPEG_BASE64, type: JPEG_TYPE }],
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`media/${TIME}${branch}.jpeg`]: JPEG_CONVERTED,
          [`tweets/${TIME}${branch}.tweet`]: `---
media:
  - file: ${TIME}${branch}.jpeg
---`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new tweet with 1 image.

There is no text in the tweet.`,
      },
    }
  );
});

test("tweet image png", async ({ t }) => {
  await t.uploadAndCrop("dice.png");
  const message = "Add tweet with media";
  const branch = "add-tweet-with-media";
  await t.submit(
    {
      media: [{ data: PNG_BASE64, type: PNG_TYPE }],
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`media/${TIME}${branch}.png`]: PNG_CONVERTED,
          [`tweets/${TIME}${branch}.tweet`]: `---
media:
  - file: ${TIME}${branch}.png
---`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new tweet with 1 image.

There is no text in the tweet.`,
      },
    }
  );
});

test("tweet image with description", async ({ t }) => {
  await t.uploadAndCrop(JPEG_NAME, JPEG_ALT);
  const message = "Add tweet with media";
  const branch = "add-tweet-with-media";
  // TODO allow longer file names for media images
  await t.submit(
    {
      media: [{ data: JPEG_BASE64, type: JPEG_TYPE, alt: JPEG_ALT }],
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`media/${TIME}${branch}-a-cute-kitten.jpeg`]: JPEG_CONVERTED,
          [`tweets/${TIME}${branch}.tweet`]: `---
media:
  - file: ${TIME}${branch}-a-cute-kitten.jpeg
    alt: A cute kitten
---`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new tweet with 1 image.

There is no text in the tweet.`,
      },
    }
  );
});

test("tweet image multiple", async ({ t }) => {
  await t.uploadAndCrop(JPEG_NAME);
  await t.uploadAndCrop(PNG_NAME);
  await t.screenshot("calculate-filesize");
  await t.uploadAndCrop(JPEG_NAME, JPEG_ALT);
  await t.uploadAndCrop(PNG_NAME, PNG_ALT);
  const message = "Add tweet with media";
  const branch = "add-tweet-with-media";
  await t.submit(
    {
      media: [
        { data: JPEG_BASE64, type: JPEG_TYPE },
        { data: PNG_BASE64, type: PNG_TYPE },
        { data: JPEG_BASE64, type: JPEG_TYPE, alt: JPEG_ALT },
        { data: PNG_BASE64, type: PNG_TYPE, alt: PNG_ALT },
      ],
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`media/${TIME}${branch}.jpeg`]: JPEG_CONVERTED,
          [`media/${TIME}${branch}-1.png`]: PNG_CONVERTED,
          [`media/${TIME}${branch}-a-cute-kitten-2.jpeg`]: JPEG_CONVERTED,
          [`media/${TIME}${branch}-translucent-dice-3.png`]: PNG_CONVERTED,
          [`tweets/${TIME}${branch}.tweet`]: `---
media:
  - file: ${TIME}${branch}.jpeg
  - file: ${TIME}${branch}-1.png
  - file: ${TIME}${branch}-a-cute-kitten-2.jpeg
    alt: A cute kitten
  - file: ${TIME}${branch}-translucent-dice-3.png
    alt: Translucent dice
---`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new tweet with 4 images.

There is no text in the tweet.`,
      },
    }
  );
});

test("tweet retweet basic", async ({ t }) => {
  await t.setQuote("Retweet");
  await t.cannotSubmit([RETWEET_VALIDATION]);
  await t.screenshot("required-quote-url");
  await t.setQuoteUrl(QUOTE_URL);
  await t.hasText(IFRAME_TEXT);
  const message = "Add retweet test";
  const branch = "add-retweet-test";
  await t.submit(
    {
      quoteUrl: QUOTE_URL,
      quoteType: "retweet",
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`tweets/${TIME}${branch}.tweet`]: `---
retweet: ${QUOTE_URL}
---`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new retweet of ${QUOTE_URL}.

There is no text in the tweet.`,
      },
    }
  );
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
  const message = "Add reply test this is my test tweet";
  const branch = "add-reply-test-this-is-my-test-tweet";
  await t.submit(
    {
      quoteUrl: QUOTE_URL,
      text: TWEET_TEXT,
      quoteType: "reply",
    },
    {
      branch,
      commit: {
        message,
        files: {
          [`tweets/${TIME}${branch}.tweet`]: `---
reply: ${QUOTE_URL}
---

${TWEET_TEXT}`,
        },
      },
      pr: {
        title: message,
        body: `This Pull Request creates a new reply to ${QUOTE_URL}.`,
      },
    }
  );
});

// TODO test remove images after editing, and before cropping.

/*
+ Object {
+   "commit": Object {
+     "branch": "test-branch-prefix/230608-0241-tweet-this-is-my-test",
+     "changes": Array [
+       Object {
+         "files": Object {
+           "tweets/230608-0241-tweet-this-is-my-test.tweet": "This is my test tweet!",
+         },
+         "message": "tweet this is my test tweet",
+       },
+     ],
+     "createBranch": true,
+     "owner": "test-owner",
+     "repo": "TEST",
+   },
+   "pr": Object {
+     "base": "test-base",
+     "body": "This Pull Request creates a new tweet.
+
+ ---
+ *Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*",
+     "head": "test-branch-prefix/230608-0241-tweet-this-is-my-test",
+     "owner": "test-owner",
+     "repo": "TEST",
+     "title": "tweet this is my test tweet",
+   },
+ }
*/
