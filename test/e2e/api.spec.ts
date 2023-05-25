import { test as base } from "@playwright/test";
import { ApiFixture } from "@/../test/fixtures/api.fixture";
import { getConfig } from "@/util/config";

const repo = "TEST";
const contribution = "tweet";

const postBase = {
  authorization: "anon",
  text: "This is my test tweet!",
  repo,
  contribution,
};

const config = getConfig(repo, contribution);

function createMessage(text: string) {
  return `${text}${config.prPostfix}`;
}

const testCommit = {
  branch: "test-branch",
  name: "test-name",
  files: {
    "test.txt": "test-content",
  },
};

const prBase = {
  repo,
  base: config.base,
  title: testCommit.name,
  head: `${config.branchPrefix}${testCommit.branch}`,
  owner: config.owner,
  body: createMessage("Automated Pull Request"),
};

const test = base.extend<{ a: ApiFixture }>({
  a: ({}, use) => {
    use(
      new ApiFixture({
        postBase,
        prBase,
        // pass in a fake transform
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
  const customName = "test name";
  await a.expect(
    { customMessage, customName },
    { pr: { body: createMessage(customMessage), title: customName } }
  );
});

test("api rejects long names", async ({ a }) => {
  const customName = new Array(101).fill("a").join("");
  await a.expect({ customName }, { error: "Name is too long" });
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
  await a.expect({ repo: undefined }, { error: "No repo specified" });
  await a.expect({ repo: "hax" }, { error: "Invalid repo" });
});

test("api rejects invalid contribution type", async ({ a }) => {
  await a.expect(
    { contribution: undefined },
    { error: "No contribution specified" }
  );
  await a.expect({ contribution: "hax" }, { error: "Invalid contribution" });
});

// TODO test twitter specific api requests
