import { Page, Locator, expect, test } from "@playwright/test";
import { testPr } from "test/mocks/mocktokit";

import { DEFAULTS } from "@/lib/constants";
import { deepTrimImageData } from "./deepTrimImageData";

type FormFixtureProps = {
  baseURL?: string;
  repo: string;
  contribution: string;
  page: Page;
  footer?: string;
};

export default function formTest({
  repo,
  contribution,
  footer,
}: {
  repo: string;
  contribution: string;
  footer?: string;
}) {
  return test.extend<{ f: FormFixture }>({
    f: async ({ page, baseURL }, use) => {
      const t = new FormFixture({
        page,
        baseURL,
        repo,
        footer,
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
  readonly FOOTER: string;
  private readonly submitUrl: string;
  private readonly submitButton: Locator;

  constructor({ repo, footer, contribution, page, baseURL }: FormFixtureProps) {
    this.page = page;
    this.path = `/contribute/${repo}/${contribution}`;
    this.submitUrl = `${baseURL}/api/contribute`;
    this.submitButton = page.locator('button[type="submit"]');
    this.FOOTER = footer || DEFAULTS.prPostfix;
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
        throw new Error("Test environment is not set up correctly!");
      }

      res = json.test;

      // return dummy date for screeenshot
      await route.fulfill({ json: { pr: json.pr } });
    });

    // wait for the submit button to be enabled
    await expect(this.submitButton).toBeEnabled();
    // await this.screenshot("form-completed");
    await this.submitButton.click();

    // click the confirmation button
    await this.page
      .locator("#confirmation_modal")
      .getByRole("button", { name: "Confirm", exact: true })
      .click();

    await this.hasText(testPr.url);

    return { req: deepTrimImageData(req), res };
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

  getByLabel(fieldTitle: string, locator?: Locator) {
    return (locator || this.page)
      .locator("label")
      .filter({ has: this.page.getByText(fieldTitle, { exact: true }) })
      .last()
      .locator("..");
  }

  async setText(fieldTitleOrLocator: string | Locator, text: string) {
    const locator = (
      typeof fieldTitleOrLocator === "string"
        ? this.getByLabel(fieldTitleOrLocator)
        : fieldTitleOrLocator
    ).getByRole("textbox");
    await locator.fill(text);
    // blur if possible for validation
    if (await locator.isVisible()) {
      await locator.blur();
    }
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

  getCollection(fieldName: string, path: (string | number)[]) {
    let locator = this.getByLabel(fieldName);
    for (const p of path) {
      if (typeof p === "string") {
        locator = this.getByLabel(p, locator);
      } else {
        locator = locator.locator("> .flex > .collection").nth(p);
      }
    }
    return locator;
  }

  async setCollectionText(
    fieldName: string,
    path: (string | number)[],
    string: string
  ) {
    const locator = this.getCollection(fieldName, path);
    await this.setText(locator, string);
  }

  async signIn() {
    await this.page.getByText("Sign in with Github").first().click();
    await this.page.getByText("Sign in with Test Credentials").click();
  }
}
