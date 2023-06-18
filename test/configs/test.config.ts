import type { UserConfig } from "@/types";

import { demo, e2e } from "@/lib/env";

import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";
import news from "@/lib/contribution/etc/news";
import link from "@/lib/contribution/etc/link";
import app from "@/lib/contribution/etc/app";

import testLinkCategories from "./link.categories";

const contributions = {
  app: app({
    description: "My App Description",
    relativeImagePath: "./images",
    absoluteImagePath: "content/services/apps/images",
    collectionPath: "test/data/apps.yaml",
  }),
  link: link({
    categories: testLinkCategories,
  }),
  news: news({
    collectionPath: "test/data/news.yaml",
  }),
  tweet: tweet({
    description: "Here's my custom description",
  }),
  api: contribution({
    title: "Simple Test",
    hidden: true,
    commit: async ({ body }: { body: { text: string } }) => ({
      files: { "test.md": body.text },
    }),
    form: {
      fields: {
        text: {
          type: "text",
          title: "Text",
          validation: { required: true },
        },
      },
    },
  }),
};

let exported;

if (e2e) {
  exported = {
    authorization: ["github", "anon"],
    title: "E2E C11R",
    description:
      "This is a test mode for end-to-end testing, using a Mock Github API",
    owner: "test-owner",
    base: "test-base",
    branchPrefix: "test-branch-prefix/",
    repos: {
      TEST: {
        title: "TEST REPO TITLE",
        description: "TEST REPO DESCRIPTION",
        contributions,
      },
    },
  };
} else if (demo) {
  exported = {
    authorization: ["github", "captcha"],
    repos: {
      Sample: {
        title: "Sample Repo",
        description: "A demo repository to test out Contribunator",
        contributions,
      },
    },
  };
}

export default exported as UserConfig;
