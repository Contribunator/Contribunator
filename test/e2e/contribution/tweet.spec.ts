import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "tweet" });

test("tweet submits basic", async ({ f }) => {
  // return;
  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.setText("Tweet Text", "My Test Tweet");

  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "tweet",
      repo: "TEST",
      text: "My Test Tweet",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-tweet-my-test-tweet",
        changes: [
          {
            files: {
              "tweets/timestamp-add-tweet-my-test-tweet.tweet": "My Test Tweet",
            },
            message: "Add tweet my test tweet",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This Pull Request creates a new tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-tweet-my-test-tweet",
        owner: "test-owner",
        repo: "TEST",
        title: "Add tweet my test tweet",
      },
    },
  });
});

test("tweet retweet", async ({ f }) => {
  // return;
  await f.clickButton("Quote Type", "Retweet");

  await f.cannotSubmit(["Required retweet URL"]);

  await f.setText("Quote URL", "https://twitter.com/test/status/123");

  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "tweet",
      quoteType: "retweet",
      quoteUrl: "https://twitter.com/test/status/123",
      repo: "TEST",
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
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This Pull Request creates a new retweet of https://twitter.com/test/status/123.

There is no text in the tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-retweet-test",
        owner: "test-owner",
        repo: "TEST",
        title: "Add retweet test",
      },
    },
  });
});

test("tweet reply", async ({ f }) => {
  // return;
  await f.clickButton("Quote Type", "Reply");

  await f.cannotSubmit([
    "Required reply URL",
    "Required unless retweeting or uploading images",
  ]);

  await f.setText("Quote URL", "https://twitter.com/test/status/456");

  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.setText("Tweet Text", "Tweet Reply Here");

  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "tweet",
      quoteType: "reply",
      quoteUrl: "https://twitter.com/test/status/456",
      repo: "TEST",
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
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This Pull Request creates a new reply to https://twitter.com/test/status/456.${f.FOOTER}`,
        head: "c11r/timestamp-add-reply-test-tweet-reply-here",
        owner: "test-owner",
        repo: "TEST",
        title: "Add reply test tweet reply here",
      },
    },
  });
});

test("tweet image", async ({ f }) => {
  // return;
  await f.cannotSubmit(["Required unless retweeting or uploading images"]);

  await f.uploadAndCrop("Upload Images (4 remaining)", "kitten.jpg");

  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "tweet",
      media: [
        {
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
      ],
      repo: "TEST",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-tweet-with-media",
        changes: [
          {
            files: {
              "media/timestamp-add-tweet-with-media.jpeg": "blob,[XjjDgGJlB7]",
              "tweets/timestamp-add-tweet-with-media.tweet": `---
media:
  - file: timestamp-add-tweet-with-media.jpeg
---`,
            },
            message: "Add tweet with media",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This Pull Request creates a new tweet with 1 image.

There is no text in the tweet.${f.FOOTER}`,
        head: "c11r/timestamp-add-tweet-with-media",
        owner: "test-owner",
        repo: "TEST",
        title: "Add tweet with media",
      },
    },
  });
});

test("tweet reply with images and alts", async ({ f }) => {
  // return;
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

  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "tweet",
      media: [
        {
          alt: "My Kitten",
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
        {
          alt: "Some Dice",
          data: "data:image/png;base64,[KncJzlfHSB]",
          type: "png",
        },
        {
          data: "data:image/jpeg;base64,[vM7xIELqet]",
          type: "jpeg",
        },
        {
          data: "data:image/png;base64,[KncJzlfHSB]",
          type: "png",
        },
      ],
      quoteType: "reply",
      quoteUrl: "https://twitter.com/test/status/456",
      repo: "TEST",
      text: "Tweet Reply Here",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-reply-test-with-media-tweet-reply-here",
        changes: [
          {
            files: {
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-2.jpeg":
                "blob,[XjjDgGJlB7]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-3.png":
                "blob,[NMmsnTn0xi]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-my.jpeg":
                "blob,[XjjDgGJlB7]",
              "media/timestamp-add-reply-test-with-media-tweet-reply-here-some-1.png":
                "blob,[NMmsnTn0xi]",
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
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This Pull Request creates a new reply to https://twitter.com/test/status/456 with 4 images.${f.FOOTER}`,
        head: "c11r/timestamp-add-reply-test-with-media-tweet-reply-here",
        owner: "test-owner",
        repo: "TEST",
        title: "Add reply test with media tweet reply here",
      },
    },
  });
});
