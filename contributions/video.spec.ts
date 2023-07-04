import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "_E2E_test", contribution: "video" });

test("video submits basic", async ({ f }) => {
  await f.cannotSubmit(["Youtube Video ID is a required field"]);

  await f.setText(
    "Youtube Video ID",
    "https://www.youtube.com/watch?v=GCBv1VCN2tE"
  );

  // return;
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "video",
      repo: "_E2E_test",
      youtube: "GCBv1VCN2tE",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-video-e2e-test-video-author-e2e-test-video",
        changes: [
          {
            files: {
              "test/etc/videos.yaml": `- title: E2E Test Video Title
  date: TIMESTAMP
  uploaded: PUBLISHED
  youtube: GCBv1VCN2tE
  authorYoutube: channel/CHANNEL_ID
  author: E2E Test Video Author
- title: Test Video
  date: 2022-02-08
  uploaded: 2022-02-08
  youtube: o4n6pqRyA1c
  tags:
    - discussions
    - explainers
  author: Existing Author
  authorYoutube: c/channel_name
  description: my description here
`,
            },
            message: "Add Video: E2E Test Video Author - E2E Test Video Title",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "_E2E_test",
        base: "main",
      },
      pr: {
        base: "main",
        body: `This PR adds the video [E2E Test Video Title](https://www.youtube.com/watch?v=GCBv1VCN2tE) by [E2E Test Video Author](https://www.youtube.com/channel/CHANNEL_ID).${f.FOOTER}`,
        head: "c11r/timestamp-add-video-e2e-test-video-author-e2e-test-video",
        owner: "test-owner",
        repo: "_E2E_test",
        title: "Add Video: E2E Test Video Author - E2E Test Video Title",
      },
    },
  });
});

test("video submits full", async ({ f }) => {
  await f.cannotSubmit(["Youtube Video ID is a required field"]);

  await f.setText(
    "Youtube Video ID",
    "https://www.youtube.com/watch?v=GCBv1VCN2tE"
  );

  await f.clickButton("Tags", "Explainers");
  await f.clickButton("Tags", "Tutorials");
  await f.clickButton("Tags", "Trading");

  await f.setText("Override Title", "Custom Title");
  await f.setText("Optional Description", "Custom Multiline\n\nDescription");

  // return;
  expect(await f.submit()).toEqual({
    req: {
      authorization: "anon",
      contribution: "video",
      description: `Custom Multiline

Description`,
      repo: "_E2E_test",
      tags: ["explainers", "tutorials", "trading"],
      title: "Custom Title",
      youtube: "GCBv1VCN2tE",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-video-e2e-test-video-author-custom-title",
        changes: [
          {
            files: {
              "test/etc/videos.yaml": `- title: Custom Title
  date: TIMESTAMP
  uploaded: PUBLISHED
  youtube: GCBv1VCN2tE
  authorYoutube: channel/CHANNEL_ID
  author: E2E Test Video Author
  tags:
    - explainers
    - tutorials
    - trading
  description: |-
    Custom Multiline

    Description
- title: Test Video
  date: 2022-02-08
  uploaded: 2022-02-08
  youtube: o4n6pqRyA1c
  tags:
    - discussions
    - explainers
  author: Existing Author
  authorYoutube: c/channel_name
  description: my description here
`,
            },
            message: "Add Video: E2E Test Video Author - Custom Title",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "_E2E_test",
        base: "main",
      },
      pr: {
        base: "main",
        body: `This PR adds the video [Custom Title](https://www.youtube.com/watch?v=GCBv1VCN2tE) by [E2E Test Video Author](https://www.youtube.com/channel/CHANNEL_ID).${f.FOOTER}`,
        head: "c11r/timestamp-add-video-e2e-test-video-author-custom-title",
        owner: "test-owner",
        repo: "_E2E_test",
        title: "Add Video: E2E Test Video Author - Custom Title",
      },
    },
  });
});
