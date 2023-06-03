import { Locator, expect } from "@playwright/test";
import { PageFixture, PageFixtureProps } from "./page.fixture";

import { getContribution } from "@/lib/config";

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
    const {
      contribution: { type },
    } = getContribution(repo, contribution);
    // TODO, do a full E2E test with a real server
    this.submitUrl = `${baseURL}/api/contribute/${type}`;
    this.body = {
      repo,
      contribution,
      authorization: "anon", // TODO make configurable when needed
      customMessage: "",
      customTitle: "",
      ...body,
    };

    this.submitButton = page.locator('button[type="submit"]');
  }

  async submit(expected: any) {
    const prUrl = "https://github.com/test-pr-url";
    // intercept the route and ensure the correct JSON is being sent
    // TODO intercept on server-side
    await this.page.route(this.submitUrl, async (route) => {
      try {
        const body = (await route.request().postData()) as string;
        const parsed = JSON.parse(body);
        // only test image headers
        parsed.media = parsed.media.map((media: string) => media.split(",")[0]);
        expect(parsed).toEqual({ ...this.body, ...expected });
        await route.fulfill({ json: { prUrl } });
      } catch (e) {
        await route.abort();
        throw e;
      }
    });
    this.page.once("dialog", (dialog) => dialog.accept());

    // wait for the submit button to be enabled
    await expect(this.submitButton).toBeEnabled();
    await this.screenshot("form-completed");

    await this.submitButton.click();
    await expect(this.page.getByRole("link", { name: prUrl })).toBeVisible();
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
