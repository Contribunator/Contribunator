import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "_E2E_test", contribution: "link" });

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

  expect(await f.submit()).toMatchObject({
    req: {
      category: "wallets.web",
      contribution: "link",
      link: "https://example.link",
      name: "My Test Link",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-link-my-test-link",
        changes: [
          {
            files: {
              "test/etc/wallets.yaml": `items:
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
`,
            },
            message: "Add Link: My Test Link",
          },
        ],
      },
      pr: {
        body: `This PR adds a new Link:

## Category
Web Wallet

## Name
My Test Link

## URL
https://example.link${f.FOOTER}`,
        head: "c11r/timestamp-add-link-my-test-link",
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

  expect(res).toMatchObject({
    commit: {
      changes: [
        {
          files: {
            "test/etc/channels.yaml": `items:
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
      A Test Link:
        __name: A Test Link
        __link: https://example.link
        __icon: twitter
      Existing Test:
        __name: Existing Test
        __link: https://example.com
`,
          },
        },
      ],
    },
  });
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

  expect(res).toMatchObject({
    commit: {
      changes: [
        {
          files: {
            "test/etc/tooling.yaml": `items:
  prices:
    items:
      Existing Test:
        __name: Existing Test
        __link: https://example.com
  repos:
    items:
      Another Test:
        __name: Another Test
        __link: https://example.link
        description: |-
          A multine

          description
      Existing Test:
        __name: Existing Test
        __link: https://example.com
`,
          },
        },
      ],
    },
  });
});
