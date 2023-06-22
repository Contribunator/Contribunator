import { expect } from "@playwright/test";
import formTest from "@/../test/fixtures/form.fixture";

const test = formTest({ repo: "TEST", contribution: "video" });

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
      repo: "TEST",
      youtube: "GCBv1VCN2tE",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-video-gcbv1vcn2te",
        changes: [
          {
            files: {
              "test/data/videos.yaml": `- title: My Video Title
  date: TIMESTAMP
  uploaded: PUBLISHED
  youtube: GCBv1VCN2tE
  authorYoutube: channel/CHANNEL_ID
  author: My Channel Title
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
            message: "Add Video: GCBv1VCN2tE",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds the video https://www.youtube.com/watch?v=GCBv1VCN2tE${f.FOOTER}`,
        head: "c11r/timestamp-add-video-gcbv1vcn2te",
        owner: "test-owner",
        repo: "TEST",
        title: "Add Video: GCBv1VCN2tE",
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
      repo: "TEST",
      tags: ["explainers", "tutorials", "trading"],
      title: "Custom Title",
      youtube: "GCBv1VCN2tE",
    },
    res: {
      commit: {
        branch: "c11r/timestamp-add-video-gcbv1vcn2te",
        changes: [
          {
            files: {
              "test/data/videos.yaml": `- title: Custom Title
  date: TIMESTAMP
  uploaded: PUBLISHED
  youtube: GCBv1VCN2tE
  authorYoutube: channel/CHANNEL_ID
  author: My Channel Title
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
            message: "Add Video: GCBv1VCN2tE",
          },
        ],
        createBranch: true,
        owner: "test-owner",
        repo: "TEST",
      },
      pr: {
        base: "main",
        body: `This PR adds the video https://www.youtube.com/watch?v=GCBv1VCN2tE${f.FOOTER}`,
        head: "c11r/timestamp-add-video-gcbv1vcn2te",
        owner: "test-owner",
        repo: "TEST",
        title: "Add Video: GCBv1VCN2tE",
      },
    },
  });
});
