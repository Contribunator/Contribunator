import { AppConfig } from "@/lib/config";

import tweetConfig from "@/contributions/tweet";
import newsConfig from "@/contributions/etc/news";
import genericConfig from "@/contributions/generic/config";
import linkConfig from "@/contributions/etc/link";
import appConfig from "@/contributions/etc/app";

import { APPS_COLLECTION, NEWS_COLLECTION } from "test/mocks/mocktokit";

import testLinkCategories from "./etc/link.categories";

const contributions = {
  app: appConfig({
    description: "My App Description",
    options: {
      relativeImagePath: "./images",
      absoluteImagePath: "content/services/apps/images",
      // collectionPath: "content/services/apps/apps.collection.yaml",
      collectionPath: APPS_COLLECTION,
    },
  }),
  link: linkConfig({
    options: { categories: testLinkCategories },
  }),
  news: newsConfig({
    options: { collectionPath: NEWS_COLLECTION },
  }),
  tweet: tweetConfig({
    options: { description: "Here's my custom description" },
  }),
  api: genericConfig({
    title: "Simple API Test",
    options: {
      commit: async ({ body }) => ({ files: { "test.md": body.text } }),
      fields: {
        text: {
          type: "text",
          title: "Text",
        },
      },
    },
  }),
};

export const E2E: AppConfig = {
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

export const DEV: AppConfig = {
  title: "DEV C11R",
  repos: {
    Another: {
      title: "Testing",
      description: "Test Description",
      contributions,
    },
  },
};

export const DEMO: AppConfig = {
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A useless and vandalized demo repository for Contribunator",
      contributions,
    },
  },
};

let exported: null | AppConfig = null;

if (process.env.NEXT_PUBLIC_TESTING === "E2E") {
  exported = E2E;
}

if (process.env.NEXT_PUBLIC_TESTING === "DEMO") {
  exported = DEMO;
}

if (process.env.NEXT_PUBLIC_TESTING === "DEV") {
  exported = DEV;
}

export default exported;
