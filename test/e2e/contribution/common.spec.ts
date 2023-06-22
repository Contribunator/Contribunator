// tests for common contribution options

import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "api" });

test("basic submit", async ({ f }) => {
  await f.hasText("Contribution");
  await f.hasText("A Generic Contribution");
  await f.hasText(
    "Submits a Pull Request to https://github.com/test-owner/TEST."
  );
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", "My Text");
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "api",
      repo: "TEST",
      text: "My Text",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-contribution",
        changes: [
          {
            files: {
              "test.md": "My Text",
            },
            message: "Add Contribution",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds a new Contribution:

## Text
My Text${f.FOOTER}`,
        head: "c11r/timestamp-add-contribution",
        owner: "test-owner",
        repo: "TEST",
        title: "Add Contribution",
      },
    },
  });
});

test("custom message and title", async ({ page, f }) => {
  await f.setText("Text", "Text Body");
  await page.getByText("Advanced Options").locator("..").click();
  await f.setText("Custom Pull Request Title", "My Custom Title");
  await f.setText("Custom Pull Request Message", "My Custom Message");
  expect(await f.submit()).toMatchObject({
    req: {
      customMessage: "My Custom Message",
      customTitle: "My Custom Title",
      text: "Text Body",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-my-custom-title",
        changes: [
          {
            files: {
              "test.md": "Text Body",
            },
            message: "My Custom Title",
          },
        ],
      },
      pr: {
        body: `My Custom Message${f.FOOTER}`,
        head: "c11r/timestamp-my-custom-title",
        title: "My Custom Title",
      },
    },
  });
});

const overridesTest = formTest({ repo: "overrides", contribution: "test" });

overridesTest("test repo/contribution overrides", async ({ f, page }) => {
  await f.hasText("Override Contribution Title");
  await f.hasText("Override Contribution Description");
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", "My Text");
  expect(await f.submit()).toMatchObject({
    res: {
      commit: {
        branch: "prefix-override/timestamp-add-override-contribution-title",
        owner: "owner-override",
        repo: "overrides",
      },
      pr: {
        base: "base-override",
        head: "prefix-override/timestamp-add-override-contribution-title",
        owner: "owner-override",
        repo: "overrides",
      },
    },
  });
});

/* TEST CREDENTIALS UI */

const githubTest = formTest({ repo: "github", contribution: "test" });

githubTest("github login required", async ({ f, page }) => {
  await f.cannotSubmit();
  await f.hasText("You must sign in to submit this type of contribution");
  await f.signIn();
  await f.hasText("Contributing as Test User");
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", "My Text");
  expect(await f.submit()).toMatchObject({
    req: {
      authorization: "github",
    },
    res: {
      commit: {
        author: {
          email: "test@email.com",
          name: "Test User",
        },
      },
    },
  });
});

const apiOnlyTest = formTest({ repo: "api", contribution: "test" });

apiOnlyTest("api only", async ({ f }) => {
  await f.cannotSubmit();
  await f.hasText("This contribution is only available via an API");
});

const anonTest = formTest({ repo: "anon", contribution: "test" });

anonTest("anon-only form ignores github creds", async ({ f, page }) => {
  await page.goto("/");
  await f.signIn();
  await f.init();
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", "My Text");
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "test",
      repo: "anon",
      text: "My Text",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-contribution",
        changes: [
          {
            files: {
              "test.md": "My Text",
            },
            message: "Add Contribution",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "anon",
      },
      pr: {
        base: "main",
        body: `This PR adds a new Contribution:

## Text
My Text

---
*Created using [Contribunator Bot](https://github.com/Contribunator/Contribunator)*`,
        head: "c11r/timestamp-add-contribution",
        owner: "test-owner",
        repo: "anon",
        title: "Add Contribution",
      },
    },
  });
});
