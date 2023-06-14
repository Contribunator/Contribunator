import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "news" });

test("news submits basic", async ({ f }) => {
  await f.cannotSubmit([
    "Article name is a required field",
    "Article URL is a required field",
    "Tags is a required field",
  ]);
  await f.setText("Article Name", "My Test Article");
  await f.setText("Article URL", "https://example.com");
  await f.setText("Author Name", "Bobby Tables");
  await f.setText("Source Name", "New York Times");

  await f.clickButton("Tags", "Development");
  await f.clickButton("Tags", "Teams");
  await f.clickButton("Tags", "Series");

  // return;
  expect(await f.submit()).toEqual({
    req: {
      author: "Bobby Tables",
      authorization: "anon",
      contribution: "news",
      link: "https://example.com",
      name: "My Test Article",
      repo: "TEST",
      source: "New York Times",
      tags: ["development", "teams", "series"],
    },
    res: {
      commit: {
        branch: "test-branch-prefix/timestamp-add-news-item-my-test-article",
        changes: [
          {
            files: {
              "test/data/news.yaml": `- date: TIMESTAMP
  name: My Test Article
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
        base: "test-base",
        body: `This PR adds a new News Item:

## Article Name
My Test Article

## Article URL
https://example.com

## Author Name
Bobby Tables

## Source Name
New York Times

## Tags
development, teams, series

---
*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*`,
        head: "test-branch-prefix/timestamp-add-news-item-my-test-article",
        owner: "test-owner",
        repo: "TEST",
        title: "Add News Item: My Test Article",
      },
    },
  });
});
