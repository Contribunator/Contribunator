import { test as base, expect } from "@playwright/test";

import {
  ApiFixture,
  baseReq,
  baseRes,
  prPostfix,
} from "@/../test/fixtures/api.fixture";

const test = base.extend<{ a: ApiFixture }>({
  a: ({ request }, use) => {
    use(new ApiFixture(request));
  },
});

test("allows valid params", async ({ a }) => {
  expect(await a.post(baseReq)).toEqual(baseRes);
  expect(
    await a.post({ ...baseReq, collection: [{ text: "hello" }] })
  ).toMatchObject({
    test: {
      commit: {
        changes: [
          {
            files: {
              "test.md": '{"text":"test text","collection":[{"text":"hello"}]}',
            },
          },
        ],
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
  ).toMatchObject({
    test: {
      commit: {
        branch: "c11r/timestamp-test-title",
        changes: [
          {
            message: "test title",
          },
        ],
      },
      pr: {
        body: `test message${prPostfix}`,
        head: "c11r/timestamp-test-title",
        title: "test title",
      },
    },
  });
});

test("disallows fields outside of schema", async ({ a }) => {
  expect(await a.post({ ...baseReq, blah: "something" })).toEqual({
    error: "Unexpected field in request body",
  });
  expect(await a.post({ ...baseReq, blah: null })).toEqual({
    error: "Unexpected field in request body",
  });
  expect(await a.post({ ...baseReq, blah: {} })).toEqual({
    error: "Unexpected field in request body",
  });
  expect(await a.post({ ...baseReq, blah: [] })).toEqual({
    error: "Unexpected field in request body",
  });
  expect(await a.post({ ...baseReq, nested: { thing: "yo" } })).toEqual({
    error: "Unexpected field in request body",
  });
  // collection extra fields
  expect(
    await a.post({
      ...baseReq,
      collection: [{ text: "hello", somethingElse: "wat" }],
    })
  ).toEqual({
    error: "Test Collection has an invalid field",
  });

  expect(
    await a.post({
      ...baseReq,
      collection: [{ text: "hello", nested: { thing: "wat" } }],
    })
  ).toEqual({
    error: "Test Collection has an invalid field",
  });

  expect(
    await a.post({
      ...baseReq,
      collection: [],
    })
  ).toEqual({
    error: "Test Collection must not be empty",
  });

  expect(
    await a.post({
      ...baseReq,
      collection: [{}],
    })
  ).toEqual({
    error: "Test Collection has an empty item",
  });

  expect(
    await a.post({
      ...baseReq,
      collection: [{}, {}],
    })
  ).toEqual({
    error: "Test Collection has an empty item",
  });
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

test("allows API key usage", async ({ request }) => {
  const data = { ...baseReq, authorization: "api" };
  const headers = { "x-api-key": "def456" };
  const res = await request.post("/api/contribute", { data, headers });
  const json = await res.json();
  expect(json).toEqual(baseRes);
});

// submits valid api creds to a repo with API disabled
test("rejects API key usage when disabled", async ({ request }) => {
  const data = {
    ...baseReq,
    authorization: "api",
    repo: "anon",
    contribution: "test",
  };
  const headers = { "x-api-key": "def456" };
  const res = await request.post("/api/contribute", { data, headers });
  const json = await res.json();
  expect(json).toEqual({ error: "Invalid authorization" });
});

test("rejects bad API key usage", async ({ request }) => {
  const data = { ...baseReq, authorization: "github" };
  const headers = { "x-api-key": "blahblahblah" };
  const res = await request.post("/api/contribute", { data, headers });
  const json = await res.json();
  expect(json).toEqual({ error: "Unauthorized" });
});
