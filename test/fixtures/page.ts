import { Browser, Page, expect } from "@playwright/test";

export type PageFixtureProps = {
  page: Page;
  path: string;
  headless: boolean;
};

export class PageFixture {
  readonly page: Page;
  readonly path: string;
  readonly headless: boolean;
  private screenshotCounter = 0;

  constructor({ page, path, headless }: PageFixtureProps) {
    this.page = page;
    this.path = path;
    this.headless = headless;
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async hasTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async hasText(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async screenshot(name: string = "") {
    this.screenshotCounter++;
    const paddedCounter = this.screenshotCounter.toString().padStart(2, "0");
    const fileName = `${paddedCounter}${name ? `-${name}` : ""}.png`;
    // do not take screenshots in headless mode
    if (!this.headless) {
      await expect(this.page).toHaveScreenshot(fileName, { fullPage: true });
    }
  }
}
