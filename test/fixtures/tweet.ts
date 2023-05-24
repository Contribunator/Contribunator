import { Locator } from "@playwright/test";
import { ContributionFixture, ContributionFixtureProps } from "./contribution";

export class TweetFixture extends ContributionFixture {
  private readonly textBox: Locator;

  constructor(props: ContributionFixtureProps) {
    super({
      ...props,
      // tweet-specific JSON fields
      body: {
        quoteUrl: "",
        text: "",
        media: ["", "", "", ""],
        alt_text_media: ["", "", "", ""],
      },
    });
    this.textBox = this.page.getByPlaceholder("e.g. This is my tweet!");
  }

  async fillText(text: string) {
    await this.textBox.fill(text);
  }
}
