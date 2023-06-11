import { ConfigWithContribution, getContribution } from "@/lib/config";
import { APIRequestContext, expect } from "@playwright/test";

type ApiFixtureProps = {
  request: APIRequestContext;
  postDefaults: {
    authorization: string;
    repo: string;
    contribution: string;
    text: string;
  };
};

type TestResposne = {
  commit?: any;
  pr?: any;
};

export class ApiFixture {
  private postDefaults: any;
  private request: APIRequestContext;
  private config: ConfigWithContribution;
  private pr: any;
  private commit: any;

  url = "/api/contribute/generic";

  constructor(props: ApiFixtureProps) {
    this.request = props.request;
    this.postDefaults = props.postDefaults;
    const { repo, contribution } = this.postDefaults;

    this.config = getContribution(repo, contribution);
    const { title, message } = this.config.contribution.prMetadata(
      props.postDefaults
    );

    // define the expected values for basic PR and commit
    this.pr = {
      repo,
      base: this.config.base,
      title,
      head: this.config.branchPrefix,
      owner: this.config.owner,
      body: `${message}${this.config.prPostfix}`,
    };

    this.commit = {
      branch: this.config.branchPrefix,
      changes: [
        {
          files: {
            "test.md": this.postDefaults.text,
          },
          message: title,
        },
      ],
      createBranch: true,
      owner: this.config.owner,
      repo,
    };
  }

  async post(body: any) {
    return this.request.post(this.url, { data: body });
  }

  evaluate({ pr, commit }: TestResposne, actual: TestResposne) {
    // for now we only test the branch prefix
    actual.pr.head = actual.pr.head.split("/")[0] + "/";
    actual.commit.branch = actual.commit.branch.split("/")[0] + "/";

    if (pr?.body) {
      pr.body = pr.body + this.config.repo.prPostfix;
    }

    if (commit?.changes) {
      commit.changes.forEach((change: any, i: number) => {
        commit.changes[i] = { ...this.commit.changes[i], ...change };
      });
    }

    expect({ ...this.pr, ...pr }).toEqual(actual.pr);
    expect({ ...this.commit, ...commit }).toEqual(actual.commit);
  }

  // Note: merges the base params with the passed params
  async expect(body: any, expected: { error?: string } & TestResposne) {
    const res = await this.post({ ...this.postDefaults, ...body });
    if (expected.error) {
      expect(res.ok()).toBeFalsy();
      const { error } = await res.json();
      expect(error).toEqual(expected.error);
    } else {
      expect(res.ok()).toBeTruthy();
      const { test: actual } = await res.json();
      this.evaluate(expected, actual);
    }
  }
}
