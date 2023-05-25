import { Page, Locator, expect } from "@playwright/test";
import { PageFixture, PageFixtureProps } from "./page";

export type ContributionFixtureProps = Omit<PageFixtureProps, "path"> & {
  baseURL?: string;
  repo: string;
  contribution: string;
  body?: any;
};

export class ContributionFixture extends PageFixture {
  private readonly submitUrl: string;
  private readonly submitButton: Locator;
  private readonly body: any;

  constructor({
    repo,
    contribution,
    page,
    baseURL,
    body,
    headless,
  }: ContributionFixtureProps) {
    const path = `/contribute/${repo}/${contribution}`;
    super({ page, path, headless });
    this.submitUrl = `${baseURL}${path}/submit`;
    this.body = {
      repo,
      contribution,
      authorization: "anon", // TODO make configurable when needed
      customMessage: "",
      customName: "",
      ...body,
    };

    this.submitButton = page.locator('button[type="submit"]');
  }

  async submit(expected: any) {
    const prUrl = "https://github.com/test-pr-url";
    // intercept the route and ensure the correct JSON is being sent
    await this.page.route(this.submitUrl, async (route) => {
      const body = (await route.request().postData()) as string;
      expect(JSON.parse(body)).toEqual({ ...this.body, ...expected });
      await route.fulfill({ json: { prUrl } });
    });
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.submitButton.click();
    await this.page.getByRole("link", { name: prUrl }).isVisible();
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
}
