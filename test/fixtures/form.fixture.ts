import crypto from "crypto";
import { Page, Locator, expect, test } from "@playwright/test";
import { testPr } from "test/mocks/mocktokit";

import { DEFAULTS } from "@/lib/config";

function trimImageData(str: string) {
  let type = "blob";
  if (str.startsWith("data:image")) {
    type = str.split(",")[0];
  }
  const hash = crypto
    .createHash("sha1")
    .update(str)
    .digest("base64")
    .slice(0, 10);
  return `${type},[${hash}]`;
}

const deepFormatImageData = (obj: any): any => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepFormatImageData);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (
        typeof value === "string" &&
        (value.startsWith("data:image") ||
          key.endsWith(".jpeg") ||
          key.endsWith(".png"))
      ) {
        return [key, trimImageData(value)];
      }
      return [key, deepFormatImageData(value)];
    })
  );
};

type FormFixtureProps = {
  baseURL?: string;
  repo: string;
  contribution: string;
  page: Page;
};

export default function formTest({
  repo,
  contribution,
}: {
  repo: string;
  contribution: string;
}) {
  return test.extend<{ f: FormFixture }>({
    f: async ({ page, baseURL }, use) => {
      const t = new FormFixture({
        page,
        baseURL,
        repo,
        contribution,
      });
      await t.init();
      await use(t);
    },
  });
}

export class FormFixture {
  readonly page: Page;
  readonly path: string;
  readonly FOOTER = DEFAULTS.prPostfix;
  private readonly submitUrl: string;
  private readonly submitButton: Locator;

  constructor({ repo, contribution, page, baseURL }: FormFixtureProps) {
    this.page = page;
    this.path = `/contribute/${repo}/${contribution}`;
    this.submitUrl = `${baseURL}/api/contribute`;
    this.submitButton = page.locator('button[type="submit"]');
  }

  async init() {
    await this.page.goto(this.path);
  }

  async hasText(text: string) {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }

  async hasNoText(text: string) {
    await expect(this.page.getByText(text, { exact: true })).not.toBeVisible();
  }

  async submit() {
    let req: any;
    let res: any;

    // get the the request and response
    await this.page.route(this.submitUrl, async (route) => {
      const body = await route.request().postData();
      req = JSON.parse(body as string);

      const response = await route.fetch();
      const json = await response.json();

      if (!json.test) {
        throw new Error("Text environment is not set up!");
      }

      res = json.test;

      // return dummy date for screeenshot
      await route.fulfill({ json: { pr: json.pr } });
    });

    this.page.once("dialog", (dialog) => dialog.accept());

    // wait for the submit button to be enabled
    await expect(this.submitButton).toBeEnabled();
    // await this.screenshot("form-completed");
    await this.submitButton.click();
    await this.hasText(testPr.url);

    return deepFormatImageData({ req, res });
  }

  // asser that validation errors exist
  async cannotSubmit(errors: string[] = []) {
    // check error messages exist
    for (const text of errors) {
      await this.hasText(text);
    }
    // make sure that the button is disabled
    await expect(this.submitButton).toBeDisabled();
  }

  getByLabel(fieldTitle: string) {
    return this.page
      .locator("label")
      .filter({ has: this.page.getByText(fieldTitle, { exact: true }) })
      .last()
      .locator("..");
  }

  async setText(fieldTitle: string, text: string) {
    const locator = await this.getByLabel(fieldTitle).getByRole("textbox");
    await locator.fill(text);
    await locator.blur();
  }

  async clickButton(fieldTitle: string, items: string | string[]) {
    if (typeof items === "string") {
      items = [items];
    }
    const locator = this.getByLabel(fieldTitle);
    for (const item of items) {
      await locator.getByText(item, { exact: true }).first().click();
    }
  }

  async clickDropdownItem(fieldTitle: string, items: string | string[]) {
    if (typeof items === "string") {
      items = [items];
    }
    const locator = await this.getByLabel(fieldTitle).locator(".dropdown");
    await locator.click();
    for (const item of items) {
      await locator.getByText(item, { exact: true }).click();
    }
  }

  async getValue(fieldTitle: string, type?: string) {
    // todo if it's a dropdown
    const locator = this.getByLabel(fieldTitle);
    if (type === "dropdown") {
      return await locator.locator(".dropdown > label").textContent();
    }
    if (type === "buttons") {
      const selected = await locator.locator("[data-selected]");
      // join text values
      return await selected.evaluateAll((el) =>
        el.map((e) => e.textContent).join(", ")
      );
    }
    return await locator.locator("input").getAttribute("value");
  }

  async uploadImage(fieldTitle: string, filename: string) {
    await this.getByLabel(fieldTitle)
      .locator('input[type="file"]')
      .setInputFiles(`./test/assets/${filename}`);
  }

  async confirmCrop() {
    await this.page.getByText("Confirm Crop").click();
  }

  async uploadAndCrop(fieldTitle: string, filename: string, alt?: string) {
    const handle = await this.getByLabel(fieldTitle).elementHandle();
    await this.uploadImage(fieldTitle, filename);
    await this.confirmCrop();
    if (alt) {
      const input = await handle?.$("input");
      await input?.fill(alt);
    }
  }

  async signIn() {
    await this.page.getByText("Sign in with Github").first().click();
    await this.page.getByText("Sign in with Test Credentials").click();
  }
}
