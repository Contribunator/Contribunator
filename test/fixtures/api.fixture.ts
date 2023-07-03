import { APIRequestContext } from "@playwright/test";

import { DEFAULTS } from "@/lib/constants";

const { prPostfix } = DEFAULTS;

export { prPostfix };

export const baseReq = {
  authorization: "anon",
  repo: "TEST",
  contribution: "api",
  text: "test text",
};

export const baseRes = {
  pr: {
    number: 123,
    title: "This is my test commit",
    url: "https://github.com/repo/owner/pulls/123",
  },
  test: {
    commit: {
      branch: "c11r/timestamp-add-contribution",
      changes: [
        {
          files: {
            "test.md": '{"text":"test text"}',
            "test.json": `{
  "data": {
    "text": "test text"
  },
  "fetched": {
    "test": "data"
  },
  "json": {
    "hello": "json"
  },
  "md": "hello markdown\\n"
}`,
            "test.yaml": `data:
  text: test text
fetched:
  test: data
yaml:
  hello: yaml
md: |
  hello markdown
`,
          },
          message: "Add Contribution",
        },
      ],
      createBranch: true,
      owner: "test-owner",
      repo: "TEST",
      base: "main",
    },
    pr: {
      base: "main",
      body: `This PR adds a new Contribution:

## Text
test text${prPostfix}`,
      head: "c11r/timestamp-add-contribution",
      owner: "test-owner",
      repo: "TEST",
      title: "Add Contribution",
    },
  },
};

export class ApiFixture {
  private url = "/api/contribute";

  constructor(private request: APIRequestContext) {}

  async post(body: any) {
    const res = await this.request.post(this.url, { data: body });
    return res.json();
  }
}
