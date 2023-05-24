import { Page, expect } from "@playwright/test";

export class PageFixture {
  private screenshotCounter = 0;

  constructor(public page: Page, public path: string) {}

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
    await expect(this.page).toHaveScreenshot(fileName, { fullPage: true });
  }
}
