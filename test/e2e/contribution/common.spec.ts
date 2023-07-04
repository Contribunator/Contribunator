// tests for common contribution options

import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";
import { baseReq, baseRes } from "test/fixtures/api.fixture";

const test = formTest({ repo: "_E2E_test", contribution: "api" });

const baseExpected = { req: baseReq, res: baseRes.test };

test("basic submit", async ({ f }) => {
  await f.hasText("Contribution");
  await f.hasText("A Generic Contribution");
  await f.hasText(
    "Submits a Pull Request to https://github.com/test-owner/_E2E_test."
  );
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", baseExpected.req.text);
  expect(await f.submit()).toEqual(baseExpected);
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

const overridesTest = formTest({
  repo: "_E2E_overrides",
  contribution: "test",
});

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
        repo: "_E2E_overrides",
      },
      pr: {
        base: "base-override",
        head: "prefix-override/timestamp-add-override-contribution-title",
        owner: "owner-override",
        repo: "_E2E_overrides",
      },
    },
  });
});

/* TEST CREDENTIALS UI */

const githubTest = formTest({ repo: "_E2E_github", contribution: "test" });

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

const apiOnlyTest = formTest({ repo: "_E2E_api", contribution: "test" });

apiOnlyTest("api only", async ({ f }) => {
  await f.cannotSubmit();
  await f.hasText("This contribution is only available via an API");
});

const anonTest = formTest({ repo: "_E2E_anon", contribution: "test" });

anonTest("anon-only form ignores github creds", async ({ f, page }) => {
  await page.goto("/");
  await f.signIn();
  await f.init();
  await f.cannotSubmit(["Text is a required field"]);
  await f.setText("Text", "My Text");
  expect(await f.submit()).toMatchObject({
    req: {
      authorization: "anon",
      repo: "_E2E_anon",
    },
    res: {
      commit: {
        repo: "_E2E_anon",
      },
      pr: {
        repo: "_E2E_anon",
      },
    },
  });
});
