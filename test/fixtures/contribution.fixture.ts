import { Locator, expect } from "@playwright/test";
import { PageFixture, PageFixtureProps } from "./page.fixture";

import { getContribution } from "@/lib/config";
import { testPr } from "test/mocks/mocktokit";

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
      ...body,
    };

    this.submitButton = page.locator('button[type="submit"]');
  }

  async submit(expectedRequest: any, expectedReposne?: any) {
    // intercept the route and ensure the correct JSON is being sent
    // also have a mode for returning server-side resposnes
    // TODO get this from moctokit
    // evaluate the request and serverside response if passed
    await this.page.route(this.submitUrl, async (route) => {
      try {
        const body = (await route.request().postData()) as string;
        const parsed = JSON.parse(body);
        // only test image headers
        Object.entries(parsed).forEach(([key, value]: any) => {
          const trimImageData = (data: any) => {
            if (
              data &&
              typeof data === "string" &&
              data.startsWith("data:image")
            ) {
              return data.split(",")[0];
            }

            return data;
          };
          if (Array.isArray(value)) {
            parsed[key].forEach((item: any) => {
              if (item.data) {
                item.data = trimImageData(item.data);
              }
            });
          } else if (value.data) {
            parsed[key].data = trimImageData(value.data);
          }
        });
        expect(parsed).toEqual({ ...this.body, ...expectedRequest });
        if (expectedReposne) {
          const response = await route.fetch();
          const json = await response.json();
          expect(json).toEqual(expectedReposne);
          // await route.fulfill({ response, json });
        }
        // always return dummy date for screeenshot
        // TODO in future replace with server resposne
        await route.fulfill({ json: { pr: testPr } });
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
    await this.hasText(testPr.url);
    // await expect(this.page.getByRole("link", { name: prUrl })).toBeVisible();
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
