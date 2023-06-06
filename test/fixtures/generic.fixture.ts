import { expect } from "@playwright/test";
import {
  ContributionFixture,
  ContributionFixtureProps,
} from "./contribution.fixture";

export class TweetFixture extends ContributionFixture {
  constructor(props: ContributionFixtureProps) {
    super(props);
  }

  async setText(fieldTitle: string, text: string) {
    // const locator = this.page.locator('textarea[name="text"]');
    // await locator.fill(text);
    // await locator.blur();
  }

  async clickButton(fieldTitle: string, test: string) {
    // await this.page
    //   .locator("label")
    //   .filter({ hasText: "Quote Type" })
    //   .locator("..")
    //   .getByText(quote)
    //   .click();
  }

  async clickDropdownItem(fieldTitle: string, item: string) {}

  async uploadImage(fieldTitle: string, filename: string) {
    // await this.page
    //   .locator('input[type="file"]')
    //   .setInputFiles(`./test/assets/${filename}`);
  }

  async confirmCrop() {
    const cropButton = await this.hasText("Confirm Crop");
    await cropButton.click();
  }

  async uploadAndCrop(fieldTitle: string, filename: string, alt?: string) {
    // await this.uploadImage(fieldName, filename);
    // await this.confirmCrop();
    // if (alt) {
    //   const altText = this.page
    //     .getByPlaceholder("Optional image description")
    //     .last();
    //   await expect(altText).toBeVisible();
    //   await altText.fill(alt);
    // }
  }

  async clickAddItem(fieldTitle: string) {
    // todo
  }

  // todo method to upload and crop image
}
