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
      - __name: Existing Test
        __link: https://example.com
      - __name: My Test Link
        __link: https://example.link
  browsers:
    items:
      - __name: Existing Test
        __link: https://example.com
  hardware:
    items:
      - __name: Existing Test
        __link: https://example.com
  software:
    items:
      - __name: Existing Test
        __link: https://example.com
  other:
    items:
      - __name: Existing Test
        __link: https://example.com
  Trust-Minimizing Exchanges:
    items:
      - __name: Existing Test
        __link: https://example.com
  Centralized Spot Markets:
    items:
      - __name: Existing Test
        __link: https://example.com
  Centralized Derivative Markets:
    items:
      - __name: Existing Test
        __link: https://example.com
  Cross-Chain Swap Exchanges:
    items:
      - __name: Existing Test
        __link: https://example.com
  NFT Marketplaces:
    items:
      - __name: Existing Test
        __link: https://example.com
  Other:
    items:
      - __name: Existing Test
        __link: https://example.com
  Chat Rooms:
    items:
      - __name: Existing Test
        __link: https://example.com
  Development Chat:
    items:
      - __name: Existing Test
        __link: https://example.com
  Telegram Groups:
    items:
      - __name: Existing Test
        __link: https://example.com
  Forums:
    items:
      - __name: Existing Test
        __link: https://example.com
  Media:
    items:
      - __name: Existing Test
        __link: https://example.com
  Twitter Accounts:
    items:
      - __name: Existing Test
        __link: https://example.com
  Regional Website:
    items:
      - __name: Existing Test
        __link: https://example.com
  prices:
    items:
      - __name: Existing Test
        __link: https://example.com
  processors:
    items:
      - __name: Existing Test
        __link: https://example.com
  dex:
    items:
      - __name: Existing Test
        __link: https://example.com
  endpoints:
    items:
      - __name: Existing Test
        __link: https://example.com
  pools:
    items:
      - __name: Existing Test
        __link: https://example.com
  explorers:
    items:
      - __name: Existing Test
        __link: https://example.com
  monitors:
    items:
      - __name: Existing Test
        __link: https://example.com
  repos:
    items:
      - __name: Existing Test
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
      - __name: A Test Link
        __link: https://example.link
        __icon: twitter
      - __name: Existing Test
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
      - __name: Another Test
        __link: https://example.link
        __description: |-
          A multine

          description`);
});
