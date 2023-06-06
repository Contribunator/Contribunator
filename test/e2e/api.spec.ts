import { test as base } from "@playwright/test";
import { ApiFixture } from "@/../test/fixtures/api.fixture";

const TEXT = "TEST TEXT";

const test = base.extend<{ a: ApiFixture }>({
  a: ({ request }, use) => {
    use(
      new ApiFixture({
        postDefaults: {
          repo: "TEST",
          contribution: "api",
          authorization: "anon",
          text: TEXT,
        },
        request,
      })
    );
  },
});

test("allows valid params", async ({ a }) => {
  await a.expect({}, {});
});

test("applies generic option", async ({ a }) => {
  const text = "Testy McTestface";
  await a.expect(
    { text },
    { commit: { changes: [{ files: { "test.md": text } }] } }
  );
});

test("applies common options", async ({ a }) => {
  const customMessage = "test mesage";
  const customTitle = "test title";
  await a.expect(
    { customMessage, customTitle },
    {
      pr: { body: customMessage, title: customTitle },
      commit: { changes: [{ message: customTitle }] },
    }
  );
});

test("rejects long titles", async ({ a }) => {
  const customTitle = new Array(101).fill("a").join("");
  await a.expect({ customTitle }, { error: "Title is too long" });
});

test("rejects invalid auth", async ({ a }) => {
  await a.expect(
    { authorization: undefined },
    { error: "Invalid authorization" }
  );
  await a.expect({ authorization: "hax" }, { error: "Invalid authorization" });
});

test("rejects disabled auth", async ({ a }) => {
  await a.expect(
    { authorization: "captcha" },
    { error: "Invalid authorization" }
  );
});

test("rejects unauthorized github request", async ({ a }) => {
  await a.expect({ authorization: "github" }, { error: "Unauthorized" });
});

test("rejects invalid repo", async ({ a }) => {
  await a.expect({ repo: undefined }, { error: "Repo name required" });
  await a.expect({ repo: "hax" }, { error: "Repository hax not found" });
});

test("rejects invalid contribution type", async ({ a }) => {
  await a.expect(
    { contribution: undefined },
    { error: "Contribution name required" }
  );
  await a.expect(
    { contribution: "hax" },
    { error: "Contribution hax not found" }
  );
});

// TODO test auth methods
// key is easy, figure out how to test github and captcha

// various generic requests
