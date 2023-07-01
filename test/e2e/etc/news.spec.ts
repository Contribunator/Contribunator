import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "news" });

test("news submits basic", async ({ f }) => {
  await f.cannotSubmit([
    "Article Title is a required field",
    "Article URL is a required field",
    "Tags is a required field",
  ]);

  await f.setText("Article Title", "My Test Article");
  await f.setText("Article URL", "https://example.com");

  await f.clickButton("Tags", "Development");

  // return;
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "news",
      link: "https://example.com",
      repo: "TEST",
      tags: ["development"],
      title: "My Test Article",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-news-item-my-test-article",
        changes: [
          {
            files: {
              "test/etc/news.yaml": `- date: TIMESTAMP
  title: My Test Article
  link: https://example.com
  tags:
    - development
- date: 2023-02-01
  link: https://example.com/
  title: Test news item
  tags:
    - announcement
- date: 2022-09-08
  link: https://test.com/
  author: Autho Test
  source: Source Test
  title: This is some weird title.
  tags:
    - food
    - information
`,
            },
            message: "Add News Item: My Test Article",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds a new News Item:

## Article Title
My Test Article

## Article URL
https://example.com

## Tags
Development${f.FOOTER}`,
        head: "c11r/timestamp-add-news-item-my-test-article",
        owner: "test-owner",
        repo: "TEST",
        title: "Add News Item: My Test Article",
      },
    },
  });
});

test("news submits full", async ({ f }) => {
  await f.cannotSubmit([
    "Article Title is a required field",
    "Article URL is a required field",
    "Tags is a required field",
  ]);

  await f.setText("Article Title", "My Test Article");
  await f.setText("Article URL", "https://example.com");
  await f.setText("Author Name", "Bobby Tables");
  await f.setText("Source Name", "New York Times");

  await f.clickButton("Tags", "Development");
  await f.clickButton("Tags", "Teams");
  await f.clickButton("Tags", "Series");

  // TODO set the date
  await f.setText("Published Date", "2021-01-23");

  // return;
  expect(await f.submit()).toEqual({
    req: {
      author: "Bobby Tables",
      authorization: "anon",
      contribution: "news",
      date: "2021-01-23",
      link: "https://example.com",
      repo: "TEST",
      source: "New York Times",
      tags: ["development", "teams", "series"],
      title: "My Test Article",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-news-item-my-test-article",
        changes: [
          {
            files: {
              "test/etc/news.yaml": `- date: 2021-01-23
  title: My Test Article
  link: https://example.com
  author: Bobby Tables
  source: New York Times
  tags:
    - development
    - teams
    - series
- date: 2023-02-01
  link: https://example.com/
  title: Test news item
  tags:
    - announcement
- date: 2022-09-08
  link: https://test.com/
  author: Autho Test
  source: Source Test
  title: This is some weird title.
  tags:
    - food
    - information
`,
            },
            message: "Add News Item: My Test Article",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds a new News Item:

## Article Title
My Test Article

## Article URL
https://example.com

## Author Name
Bobby Tables

## Source Name
New York Times

## Tags
Development, Teams, Series

## Published Date
2021-01-23${f.FOOTER}`,
        head: "c11r/timestamp-add-news-item-my-test-article",
        owner: "test-owner",
        repo: "TEST",
        title: "Add News Item: My Test Article",
      },
    },
  });
});
