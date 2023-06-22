// tests for common contribution options

import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "api" });

test("basic submit", async ({ page, f }) => {
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