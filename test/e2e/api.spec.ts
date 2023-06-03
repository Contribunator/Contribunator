import { test as base } from "@playwright/test";
import { ApiFixture } from "@/../test/fixtures/api.fixture";
import config from "@/lib/config";

const repo = "TEST";
const contribution = "tweet";

const postBase = {
  authorization: "anon",
  text: "This is my test tweet!",
  repo,
  contribution,
};

function createMessage(text: string) {
  return `${text}${config.prPostfix}`;
}

const testCommit = {
  branch: "test-branch",
  title: "test-generated-title",
  message: "test-generated-message",
  files: {
    "test.txt": "test-content",
  },
};

const prBase = {
  repo,
  base: config.base,
  title: testCommit.title,
  head: `${config.branchPrefix}${testCommit.branch}`,
  owner: config.owner,
  body: createMessage(testCommit.message),
};

const test = base.extend<{ a: ApiFixture }>({
  a: ({}, use) => {
    use(
      new ApiFixture({
        postBase,
        prBase,
        // pass in a fake pr transformation
        transform: async () => testCommit,
      })
    );
  },
});

test("api allows valid params", async ({ a }) => {
  await a.expect(postBase, { pr: prBase });
});

test("api transforms common options", async ({ a }) => {
  const customMessage = "test mesage";
  const customTitle = "test title";
  await a.expect(
    { customMessage, customTitle },
    { pr: { body: createMessage(customMessage), title: customTitle } }
  );
});

test("api rejects long titles", async ({ a }) => {
  const customTitle = new Array(101).fill("a").join("");
  await a.expect({ customTitle }, { error: "Title is too long" });
});

// TODO test auth methods
// api key is easy, figure out how to test github and captcha

test("api rejects invalid auth", async ({ a }) => {
  await a.expect(
    { authorization: undefined },
    { error: "Invalid authorization" }
  );
  await a.expect({ authorization: "hax" }, { error: "Invalid authorization" });
});

test("api rejects invalid repo", async ({ a }) => {
  await a.expect({ repo: undefined }, { error: "Repo name required" });
  await a.expect({ repo: "hax" }, { error: "Repository hax not found" });
});

test("api rejects invalid contribution type", async ({ a }) => {
  await a.expect(
    { contribution: undefined },
    { error: "Contribution name required" }
  );
  await a.expect(
    { contribution: "hax" },
    { error: "Contribution hax not found" }
  );
});

// TODO test twitter specific api requests
