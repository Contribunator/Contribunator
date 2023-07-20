import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "_E2E_tweets", contribution: "tweet" });

test("tweet submits basic", async ({ f }) => {
  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.setText("Tweet Text", "My Test Tweet\n\nWith a newline");

  expect(await f.submit()).toMatchObject({
    req: {
      contribution: "tweet",
      text: "My Test Tweet\n\nWith a newline",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-tweet-my-test-tweet-with-a-newline",
        changes: [
          {
            files: {
              "tweets/timestamp-add-tweet-my-test-tweet-with-a-newline.tweet":
                "My Test Tweet\n\nWith a newline",
            },
            message: "Add tweet my test tweet with a newline",
          },
        ],
      },
      pr: {
        body: `This Pull Request creates a new tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-tweet-my-test-tweet-with-a-newline",
        title: "Add tweet my test tweet with a newline",
      },
    },
  });
});

test("tweet retweet", async ({ f }) => {
  await f.clickButton("Quote Type", "Retweet");

  await f.cannotSubmit(["Required retweet URL"]);

  await f.setText("Quote URL", "https://twitter.com/test/status/123");

  expect(await f.submit()).toMatchObject({
    req: {
      quoteType: "retweet",
      quoteUrl: "https://twitter.com/test/status/123",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-retweet-test",
        changes: [
          {
            files: {
              "tweets/timestamp-add-retweet-test.tweet": `---
retweet: https://twitter.com/test/status/123
---`,
            },
            message: "Add retweet test",
          },
        ],
      },
      pr: {
        body: `This Pull Request creates a new retweet of https://twitter.com/test/status/123.

There is no text in the tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-retweet-test",
        title: "Add retweet test",
      },
    },
  });
});

// TODO test overrides, tags...

test("tweet reply", async ({ f }) => {
  await f.clickButton("Quote Type", "Reply");

  await f.cannotSubmit([
    "Required reply URL",
    "Required unless retweeting or uploading images",
  ]);

  await f.setText("Quote URL", "https://twitter.com/test/status/456");

  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.setText("Tweet Text", "Tweet Reply Here");

  expect(await f.submit()).toMatchObject({
    req: {
      quoteType: "reply",
      quoteUrl: "https://twitter.com/test/status/456",
      text: "Tweet Reply Here",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-reply-test-tweet-reply-here",
        changes: [
          {
            files: {
              "tweets/timestamp-add-reply-test-tweet-reply-here.tweet": `---
reply: https://twitter.com/test/status/456
---

Tweet Reply Here`,
            },
            message: "Add reply test tweet reply here",
          },
        ],
      },
      pr: {
        body: `This Pull Request creates a new reply to https://twitter.com/test/status/456.${f.FOOTER}`,
        head: "c11r/timestamp-add-reply-test-tweet-reply-here",
        title: "Add reply test tweet reply here",
      },
    },
  });
});

test("tweet image", async ({ f }) => {
  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.uploadAndCrop("Upload Images (4 remaining)", "kitten.jpg");

  expect(await f.submit()).toMatchObject({
    req: {
      media: [
        {
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
      ],
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-tweet-with-media",
        changes: [
          {
            files: {
              "media/timestamp-add-tweet-with-media.jpeg":
                "[converted:jpeg:/9j/4A]",
              "tweets/timestamp-add-tweet-with-media.tweet": `---
media:
  - file: timestamp-add-tweet-with-media.jpeg
---`,
            },
            message: "Add tweet with media",
          },
        ],
      },
      pr: {
        body: `This Pull Request creates a new tweet with 1 image.

There is no text in the tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-tweet-with-media",
        title: "Add tweet with media",
      },
    },
  });
});

test("tweet reply with images and alts", async ({ f }) => {
  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.clickButton("Quote Type", "Reply");

  await f.cannotSubmit([
    "Required reply URL",
    "Required unless retweeting or uploading images",
  ]);

  await f.setText("Quote URL", "https://twitter.com/test/status/456");

  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.setText("Tweet Text", "Tweet Reply Here");

  await f.uploadAndCrop(
    "Upload Images (4 remaining)",
    "kitten.jpg",
    "My Kitten"
  );
  await f.uploadAndCrop("Upload Images (3 remaining)", "dice.png", "Some Dice");
  await f.uploadAndCrop("Upload Images (2 remaining)", "kitten.jpg");
  await f.uploadAndCrop("Upload Images (1 remaining)", "dice.png");

  expect(await f.submit()).toMatchObject({
    req: {
      contribution: "tweet",
      media: [
        {
          alt: "My Kitten",
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
        {
          alt: "Some Dice",
          data: "data:image/png;base64,iVBORw...",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,/9j/4A...",
          type: "jpeg",
        },
        {
          data: "data:image/png;base64,iVBORw...",
          type: "png",
        },
      ],
      quoteType: "reply",
      quoteUrl: "https://twitter.com/test/status/456",
      text: "Tweet Reply Here",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-reply-test-with-media-tweet-reply-here",
        changes: [
          {
            files: {
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-2.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-3.png":
                "[converted:png:iVBORw]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-my.jpeg":
                "[converted:jpeg:/9j/4A]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-some-1.png":
                "[converted:png:iVBORw]",
              "tweets/timestamp-add-reply-test-with-media-tweet-reply-here.tweet": `---
reply: https://twitter.com/test/status/456
media:
  - file: timestamp-add-reply-test-with-media-tweet-reply-here-my.jpeg
    alt: My Kitten
  - file: timestamp-add-reply-test-with-media-tweet-reply-here-some-1.png
    alt: Some Dice
  - file: timestamp-add-reply-test-with-media-tweet-reply-here-2.jpeg
  - file: timestamp-add-reply-test-with-media-tweet-reply-here-3.png
---

Tweet Reply Here`,
            },
            message: "Add reply test with media tweet reply here",
          },
        ],
      },
      pr: {
        body: `This Pull Request creates a new reply to https://twitter.com/test/status/456 with 4 images.${f.FOOTER}`,
        head: "c11r/timestamp-add-reply-test-with-media-tweet-reply-here",
        title: "Add reply test with media tweet reply here",
      },
    },
  });
});

const retweetText = formTest({
  repo: "_E2E_tweets",
  contribution: "tweetTextRequired",
});

retweetText("retweet with tweetTextRequired", async ({ f }) => {
  await f.cannotSubmit(["Required unless uploading images"]);
  await f.clickButton("Quote Type", "Retweet");
  await f.cannotSubmit([
    "Required retweet URL",
    "Required unless uploading images",
  ]);
  await f.setText("Quote URL", "https://twitter.com/test/status/456");
  await f.cannotSubmit(["Required unless uploading images"]);
  await f.setText("Tweet Text", "Requried Retweet Text Here");
  expect(await f.submit()).toMatchObject({
    req: {
      quoteType: "retweet",
      quoteUrl: "https://twitter.com/test/status/456",
      text: "Requried Retweet Text Here",
    },
  });
});

retweetText("media with tweetTextRequired", async ({ f }) => {
  await f.cannotSubmit(["Required unless uploading images"]);
  await f.uploadAndCrop(
    "Upload Images (4 remaining)",
    "kitten.jpg",
    "My Kitten"
  );
  expect(await f.submit()).toMatchObject({
    req: {
      contribution: "tweetTextRequired",
    },
  });
});
