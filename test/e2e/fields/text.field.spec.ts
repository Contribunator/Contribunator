import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "fields", contribution: "text" });

test("text field", async ({ f }) => {
  // basic
  await f.setText("Basic Text", "Basic Text");
  // required
  await f.cannotSubmit(["Required Text is a required field"]);
  await f.setText("Required Text", "Required Text");
  await f.hasNoText("Required Text is a required field");
  // email
  await f.setText("Email Text", "hello");
  await f.cannotSubmit(["Email Text must be a valid email"]);
  await f.setText("Email Text", "hello@email.com");
  await f.hasNoText("Email Text must be a valid email");
  // url
  await f.setText("URL Text", "hello");
  await f.cannotSubmit(["URL Text must be a valid URL"]);
  await f.setText("URL Text", "https://example.com");
  await f.hasNoText("URL Text must be a valid URL");
  // regex
  await f.setText("Regex Text", "something");
  await f.cannotSubmit(["Must match 'hello' or 'world'"]);
  await f.setText("Regex Text", "hello");
  await f.hasNoText("Must match 'hello' or 'world'");
  // transform
  await f.setText("Transform Text", "my transformation");
  await expect(f.getByLabel("Transform Text").locator("input")).toHaveValue(
    "MY TRANSFORMATION"
  );
  // date
  await f.setText("Date Text", "2022-01-20");
  const date = f.getByLabel("Date Text").locator("input");
  await expect(date).toHaveAttribute("type", "date");
  await expect(date).toHaveValue("2022-01-20");
  // textarea
  await f.setText("Textarea", "Textarea");
  const textarea = f.getByLabel("Textarea").locator("textarea");
  await expect(textarea).toBeVisible();

  const ui = await f.getByLabel("Text with all UI options");
  // prefix exists
  await expect(ui.getByText("Prefix")).toBeVisible();
  // info exists and has a link
  const info = await ui.getByText("Info here");
  await expect(info).toBeVisible();
  await expect(info).toHaveAttribute("href", "https://example.com");
  // placeholder is set
  await expect(ui.getByPlaceholder("Placeholder")).toBeVisible();
  // tags exist
  await expect(ui.getByText("tag1")).toBeVisible();
  await expect(ui.getByText("tag2")).toBeVisible();
  // tags populate
  await ui.getByText("tag1").click();
  await ui.getByText("tag2").click();
  await expect(ui.locator("input")).toHaveValue("tag1 tag2 ");
  // suggestions
  await expect(ui).toContainText(
    "Optional Suggestion: Try entering a URL, Say Hello!"
  );
  await f.setText("Text with all UI options", "hello");
  await expect(ui).toContainText("Optional Suggestion: Try entering a URL");
  // clear button
  await ui.getByTitle("Clear Field").click();
  await expect(ui).not.toContainText("Optional Suggestion");
  await expect(ui.locator("input")).toHaveValue("");
  // iframe
  const iframe = ui.getByText("iframe");
  await expect(iframe).not.toBeVisible();
  await f.setText("Text with all UI options", "https://example2.com");
  await expect(ui).toContainText("Optional Suggestion: Say Hello!");
  await expect(iframe).toBeVisible();
  await expect(iframe).toHaveText("iframe: https://example2.com");
  // submit
  expect(await f.submit()).toMatchObject({
    req: {
      textBasic: "Basic Text",
      textDate: "2022-01-20",
      textEmail: "hello@email.com",
      textRegex: "hello",
      textRequired: "Required Text",
      textTransform: "MY TRANSFORMATION",
      textUI: "https://example2.com",
      textUrl: "https://example.com",
      textarea: "Textarea",
    },
    res: {
      commit: {
        changes: [
          {
            files: {
              "test.yaml": `textBasic: Basic Text
textRequired: Required Text
textEmail: hello@email.com
textUrl: https://example.com
textRegex: hello
textTransform: MY TRANSFORMATION
textDate: 2022-01-20
textarea: Textarea
textUI: https://example2.com
`,
            },
          },
        ],
      },
      pr: {
        body: `This PR adds a new Text:

## Basic Text
Basic Text

## Required Text
Required Text

## Email Text
hello@email.com

## URL Text
https://example.com

## Regex Text
hello

## Transform Text
MY TRANSFORMATION

## Date Text
2022-01-20

## Textarea
Textarea

## Text with all UI options
https://example2.com${f.FOOTER}`,
      },
    },
  });
});
