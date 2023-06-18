import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "link" });

test("link submits basic", async ({ f }) => {
  await f.cannotSubmit([
    "Category is a required field",
    "Name is a required field",
    "URL is a required field",
  ]);

  await f.clickButton("Category", "No Selection");
  await f.clickButton("Category", "Wallet");
  await f.clickButton("Category", "Web Wallet");

  await f.setText("Name", "My Test Link");
  await f.setText("URL", "https://example.link");

  // return;
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      category: "wallets.web",
      contribution: "link",
      link: "https://example.link",
      name: "My Test Link",
      repo: "TEST",
    },
    res: {
      commit: {
        branch: "test-branch-prefix/timestamp-add-link-my-test-link",
        changes: [
          {
            files: {
              "content/services/wallets/index.yaml": `items:
  web:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
      My Test Link:
        __name: My Test Link
        __link: https://example.link
  browsers:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  hardware:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  software:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  other:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Trust-Minimizing Exchanges:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Centralized Spot Markets:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Centralized Derivative Markets:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Cross-Chain Swap Exchanges:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  NFT Marketplaces:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Other:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Chat Rooms:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Development Chat:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Telegram Groups:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Forums:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Media:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Twitter Accounts:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  Regional Website:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  prices:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  processors:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  dex:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  endpoints:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  pools:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  explorers:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  monitors:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  repos:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
`,
            },
            message: "Add Link: My Test Link",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "test-base",
        body: `This PR adds a new Link:

## Category
wallets.web

## Name
My Test Link

## URL
https://example.link

---
*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*`,
        head: "test-branch-prefix/timestamp-add-link-my-test-link",
        owner: "test-owner",
        repo: "TEST",
        title: "Add Link: My Test Link",
      },
    },
  });
});

test("link is ordered, has icons", async ({ f }) => {
  await f.clickButton("Category", "No Selection");
  await f.clickButton("Category", "Social Channels");
  await f.clickButton("Category", "Telegram Group");

  await f.setText("Name", "A Test Link");
  await f.setText("URL", "https://example.link");

  await f.getByLabel("Icon").locator(".btn-group > a:nth-child(3)").click();

  const { req, res } = await f.submit();

  expect(req.icon).toEqual("twitter");

  expect(res.commit.changes[0].files["content/community/channels/index.yaml"])
    .toContain(`Telegram Groups:
    items:
      A Test Link:
        __name: A Test Link
        __link: https://example.link
        __icon: twitter
      Existing Test:
        __name: Existing Test
        __link: https://example.com`);
});

test("link contains description", async ({ f }) => {
  await f.clickButton("Category", "No Selection");
  await f.clickButton("Category", "Mining & Development");
  await f.clickButton("Category", "Git Repository");

  const multiline = "A multine\n\ndescription";

  await f.setText("Name", "Another Test");
  await f.setText("URL", "https://example.link");
  await f.setText("Description", multiline);

  const { req, res } = await f.submit();

  expect(req.description).toEqual(multiline);

  expect(res.commit.changes[0].files["content/development/tooling/index.yaml"])
    .toContain(`repos:
    items:
      Another Test:
        __name: Another Test
        __link: https://example.link
        description: |-
          A multine

          description`);
});
