import type { UserConfig } from "@/types";

import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";
import news from "@/lib/contribution/etc/news";
import link from "@/lib/contribution/etc/link";
import app from "@/lib/contribution/etc/app";

import { APPS_COLLECTION, NEWS_COLLECTION } from "test/mocks/mocktokit";

import testLinkCategories from "./etc/link.categories";
import { demo, dev, e2e } from "@/lib/env";

export default function config(): UserConfig {
  const contributions = {
    app: app({
      description: "My App Description",
      relativeImagePath: "./images",
      absoluteImagePath: "content/services/apps/images",
      // collectionPath: "content/services/apps/apps.collection.yaml",
      collectionPath: APPS_COLLECTION,
    }),
    link: link({
      categories: testLinkCategories,
    }),
    news: news({
      collectionPath: NEWS_COLLECTION,
    }),
    tweet: tweet({
      description: "Here's my custom description",
    }),
    api: contribution({
      title: "Simple API Test",
      commit: async ({ body }: { body: { text: string } }) => ({
        files: { "test.md": body.text },
      }),
      form: {
        fields: {
          text: {
            type: "text",
            title: "Text",
          },
        },
      },
    }),
  };

  if (e2e) {
    return {
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
  }

  if (dev) {
    return {
      title: "DEV C11R",
      repos: {
        Another: {
          title: "Testing",
          description: "Test Description",
          contributions,
        },
      },
    };
  }

  if (demo) {
    return {
      repos: {
        Sample: {
          title: "Sample Repo",
          description:
            "A useless and vandalized demo repository for Contribunator",
          contributions,
        },
      },
    };
  }

  throw new Error("No config found");

  // return exported;
}
