import { Locator, expect } from "@playwright/test";
import { PageFixture, PageFixtureProps } from "./page.fixture";

import { getContribution } from "@/lib/config";
import { testPr } from "test/mocks/mocktokit";
import slugify from "@/lib/slugify";

export const TIME = `[TIMESTAMP]-`;

export type ContributionFixtureProps = Omit<PageFixtureProps, "path"> & {
  baseURL?: string;
  repo: string;
  contribution: string;
};

export class ContributionFixture extends PageFixture {
  private readonly submitUrl: string;
  private readonly submitButton: Locator;
  private readonly baseRequest: any;
  private readonly baseResponse: any;
  private readonly prPostfix: string;

  constructor({
    repo,
    contribution,
    page,
    baseURL,
    headless,
  }: ContributionFixtureProps) {
    const path = `/contribute/${repo}/${contribution}`;
    super({ page, path, headless });

    this.submitButton = page.locator('button[type="submit"]');

    const config = getContribution(repo, contribution);

    this.submitUrl = `${baseURL}/api/contribute/${config.contribution.type}`;
    this.prPostfix = config.prPostfix;

    // populate with default expected req/res values
    const baseMeta = config.contribution.prMetadata();
    this.baseRequest = {
      repo,
      contribution,
      authorization: "anon", // TODO make configurable when needed
    };
    const branchPrefix = `${config.branchPrefix}${TIME}`;
    const baseBranch = `${branchPrefix}${slugify(baseMeta.title)}`;
    this.baseResponse = {
      branchPrefix,
      pr: {
        repo,
        base: config.base,
        title: baseMeta.title,
        head: baseBranch,
        owner: config.owner,
        body: `${baseMeta.message}${config.prPostfix}`,
      },
      commit: {
        branch: baseBranch,
        message: baseMeta.title,
        createBranch: true,
        owner: config.owner,
        repo,
      },
    };
  }

  async submit(expectedRequest?: any, expectedResponse?: any) {
    // intercept the route and ensure the correct JSON is being sent
    // also have a mode for returning server-side resposnes
    // TODO get this from moctokit
    let responseData: any;
    // evaluate the request and serverside response if passed
    await this.page.route(this.submitUrl, async (route) => {
      // TEST REQUEST
      if (expectedRequest) {
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
        expect(parsed).toEqual({ ...this.baseRequest, ...expectedRequest });
      }
      // TEST RESPONSE
      if (expectedResponse) {
        const response = await route.fetch();
        const json = await response.json();

        if (!json.test) {
          throw new Error("Text environment is not set up!");
        }
        expect(json.test.commit.changes.length).toEqual(1);

        // transform the response to make it easy to compare
        // strip the timestamps from the branch name and filenames
        // regex to replace `YYMMDD-HHss-` with TIME
        const replaceRegx = /\d{6}-\d{4}-/g;

        const {
          pr,
          commit: {
            changes: [change],
            ...commit
          },
        } = json.test;

        // TODO make the filename rewriting configurable
        const files = Object.entries(change.files || {}).reduce(
          (o, [key, value]) => {
            const newFileName = key.replace(replaceRegx, TIME);
            let newValue = (value as string).replace(replaceRegx, TIME);
            // trim image data for testing
            if (
              [".png", ".jpeg", ".jpg"].find((k) => newFileName.endsWith(k))
            ) {
              newValue = (newValue as string).slice(-20);
            }

            return { ...o, [newFileName]: newValue };
          },
          {}
        );

        responseData = {
          ...json.test,
          commit: {
            ...commit,
            message: change.message,
            files,
            branch: commit.branch.replace(replaceRegx, TIME),
          },
          pr: {
            ...pr,
            head: pr.head.replace(replaceRegx, TIME),
            body: pr.body.replace(this.prPostfix, ""),
          },
        };

        // TODO make this able to be disabled?

        if (expectedResponse !== true) {
          const { branch, commit, pr } = expectedResponse;
          // let's only match the keys that are in the expected response
          // do a comparison
          if (branch) {
            const prefixedBranch = `${this.baseResponse.branchPrefix}${branch}`;
            if (pr) pr.head = prefixedBranch;
            if (commit) commit.branch = prefixedBranch;
          }
          const expectedData = {
            pr: {
              ...this.baseResponse.pr,
              ...pr,
            },
            commit: {
              ...this.baseResponse.commit,
              ...commit,
            },
          };
          expect(responseData).toEqual(expectedData);
        }
      }
      // always return dummy date for screeenshot
      // TODO in future replace with server resposne
      await route.fulfill({ json: { pr: testPr } });
    });

    this.page.once("dialog", (dialog) => dialog.accept());

    // wait for the submit button to be enabled
    await expect(this.submitButton).toBeEnabled();
    await this.screenshot("form-completed");
    await this.submitButton.click();
    await this.hasText(testPr.url);
    return responseData;
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
