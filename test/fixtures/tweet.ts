import { expect } from "@playwright/test";
import { ContributionFixture, ContributionFixtureProps } from "./contribution";

type QuoteType = "None" | "Reply" | "Retweet";

export class TweetFixture extends ContributionFixture {
  constructor(props: ContributionFixtureProps) {
    super({
      ...props,
      body: {
        quoteUrl: "",
        // quoteType: "none",
        text: "",
        media: ["", "", "", ""],
        alt_text_media: ["", "", "", ""],
      },
    });
  }

  async setText(text: string) {
    const locator = this.page.locator('textarea[name="text"]');
    await locator.fill(text);
    await locator.blur();
  }

  async setQuote(quote: QuoteType) {
    await this.page
      .locator("label")
      .filter({ hasText: "Quote Type" })
      .locator("..")
      .getByText(quote)
      .click();
  }

  async setQuoteUrl(url: string) {
    const locator = this.page.locator('input[name="quoteUrl"]');
    await locator.fill(url);
    await locator.blur();
  }

  async uploadMedia(filename: string) {
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(`./test/assets/${filename}`);
  }

  async confirmCrop() {
    const cropButton = await this.hasText("Confirm Crop");
    await cropButton.click();
  }

  async uploadAndCrop(filename: string, alt?: string) {
    await this.uploadMedia(filename);
    await this.confirmCrop();
    if (alt) {
      const altText = this.page
        .getByPlaceholder("Optional image description")
        .last();
      await expect(altText).toBeVisible();
      await altText.fill(alt);
    }
  }

  // todo method to upload and crop image
}
