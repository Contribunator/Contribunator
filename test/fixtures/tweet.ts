import { Locator } from "@playwright/test";
import { ContributionFixture, ContributionFixtureProps } from "./contribution";

type QuoteType = "none" | "reply" | "retweet";

export class TweetFixture extends ContributionFixture {
  private readonly text: Locator;
  private readonly quoteUrl: Locator;
  private readonly quoteButtons: {
    [key in QuoteType]: Locator;
  };

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
    // get textarea with name="text"
    this.text = this.page.locator('textarea[name="text"]');
    this.quoteUrl = this.page.locator('input[name="quoteUrl"]');
    const buttonGroup = this.page
      .locator("label")
      .filter({ hasText: "Quote Type" })
      .locator("..");
    this.quoteButtons = {
      none: buttonGroup.getByText("None"),
      retweet: buttonGroup.getByText("Retweet"),
      reply: buttonGroup.getByText("Reply"),
    };
  }

  async setText(text: string) {
    await this.text.fill(text);
    await this.text.blur();
  }

  async setQuote(quote: QuoteType) {
    await this.quoteButtons[quote].click();
  }
  async setQuoteUrl(url: string) {
    await this.quoteUrl.fill(url);
    await this.quoteUrl.blur();
  }
}
