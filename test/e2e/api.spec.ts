import { test as base, expect } from "@playwright/test";
import { ApiFixture } from "@/../test/fixtures/api.fixture";

const test = base.extend<{ a: ApiFixture }>({
  a: ({ request }, use) => {
    use(new ApiFixture(request));
  },
});

const baseReq = {
  authorization: "anon",
  repo: "TEST",
  contribution: "api",
  text: "test text",
};

test("allows valid params", async ({ a }) => {
  expect(await a.post(baseReq)).toEqual({
    pr: {
      number: 123,
      title: "This is my test commit",
      url: "https://github.com/repo/owner/pulls/123",
    },
    test: {
      commit: {
        branch: "test-branch-prefix/timestamp-add-simple-test",
        changes: [
          {
            files: {
              "test.md": "test text",
            },
            message: "Add Simple Test",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "test-base",
        body: `This PR adds a new Simple Test:

## Text
test text${f.FOOTER}`,
        head: "test-branch-prefix/timestamp-add-simple-test",
        owner: "test-owner",
        repo: "TEST",
        title: "Add Simple Test",
      },
    },
  });
});

test("allows custom PR options", async ({ a }) => {
  expect(
    await a.post({
      ...baseReq,
      customMessage: "test message",
      customTitle: "test title",
    })
  ).toEqual({
    pr: {
      number: 123,
      title: "This is my test commit",
      url: "https://github.com/repo/owner/pulls/123",
    },
    test: {
      commit: {
        branch: "test-branch-prefix/timestamp-test-title",
        changes: [
          {
            files: {
              "test.md": "test text",
            },
            message: "test title",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "test-base",
        body: `test message${f.FOOTER}`,
        head: "test-branch-prefix/timestamp-test-title",
        owner: "test-owner",
        repo: "TEST",
        title: "test title",
      },
    },
  });
});

test("disallows fields outside of schema", async ({ a }) => {
  expect(await a.post({ ...baseReq, blah: "something" })).toEqual({
    error: "Unexpected field in request body",
  });
  expect(await a.post({ ...baseReq, nested: { thing: "yo" } })).toEqual({
    error: "Unexpected field in request body",
  });
  // await a.expect({ text: "test", notInSchema: "test" }, { error });
  // await a.expect({ text: "test", nested: { item: "test" } }, { error });
  // TODO also test this for collections
  // TODO fix the validation extra keys in collections
});

test("rejects long titles", async ({ a }) => {
  expect(
    await a.post({ ...baseReq, customTitle: new Array(101).fill("a").join("") })
  ).toEqual({ error: "Title is too long" });
});

test("rejects invalid auth", async ({ a }) => {
  expect(await a.post({ ...baseReq, authorization: undefined })).toEqual({
    error: "Invalid authorization",
  });
  expect(await a.post({ ...baseReq, authorization: "hax" })).toEqual({
    error: "Invalid authorization",
  });
});

test("rejects disabled auth", async ({ a }) => {
  expect(await a.post({ ...baseReq, authorization: "captcha" })).toEqual({
    error: "Invalid authorization",
  });
});

test("rejects unauthorized github request", async ({ a }) => {
  expect(await a.post({ ...baseReq, authorization: "github" })).toEqual({
    error: "Unauthorized",
  });
});

test("rejects invalid repo", async ({ a }) => {
  expect(await a.post({ ...baseReq, repo: undefined })).toEqual({
    error: "Repository name required",
  });
  expect(await a.post({ ...baseReq, repo: "hax" })).toEqual({
    error: "Repository hax not found",
  });
});

test("rejects invalid contribution type", async ({ a }) => {
  expect(await a.post({ ...baseReq, contribution: undefined })).toEqual({
    error: "Contribution name required",
  });
  expect(await a.post({ ...baseReq, contribution: "hax" })).toEqual({
    error: "Contribution hax not found",
  });
});

// TODO test auth methods
// key is easy, figure out how to test github and captcha

// various generic requests
