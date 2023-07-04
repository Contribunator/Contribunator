import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({
  repo: "ethereumclassic.github.io",
  contribution: "video",
  footer:
    "\n\n---\n*Created using the [ETC Contribunator Bot](https://github.com/ethereumclassic/Contribunator)*",
});

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
      repo: "ethereumclassic.github.io",
      youtube: "GCBv1VCN2tE",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-video-e2e-test-video-author-e2e-test-video",
        changes: [
          {
            files: {
              "content/videos/videos.collection.en.yaml": `- title: E2E Test Video Title
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
        owner: "ethereumclassic",
        repo: "ethereumclassic.github.io",
        base: "main",
      },
      pr: {
        base: "main",
        body: `This PR adds the video [E2E Test Video Title](https://www.youtube.com/watch?v=GCBv1VCN2tE) by [E2E Test Video Author](https://www.youtube.com/channel/CHANNEL_ID).${f.FOOTER}`,
        head: "c11r/timestamp-add-video-e2e-test-video-author-e2e-test-video",
        owner: "ethereumclassic",
        repo: "ethereumclassic.github.io",
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
      repo: "ethereumclassic.github.io",
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
              "content/videos/videos.collection.en.yaml": `- title: Custom Title
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
        owner: "ethereumclassic",
        repo: "ethereumclassic.github.io",
        base: "main",
      },
      pr: {
        base: "main",
        body: `This PR adds the video [Custom Title](https://www.youtube.com/watch?v=GCBv1VCN2tE) by [E2E Test Video Author](https://www.youtube.com/channel/CHANNEL_ID).${f.FOOTER}`,
        head: "c11r/timestamp-add-video-e2e-test-video-author-custom-title",
        owner: "ethereumclassic",
        repo: "ethereumclassic.github.io",
        title: "Add Video: E2E Test Video Author - Custom Title",
      },
    },
  });
});
