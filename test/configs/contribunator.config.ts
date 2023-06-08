import { AppConfig } from "@/lib/config";

// TODO sort this out into different files

import kitchenSinkGenericConfig from "./kitchenSink.config";
import genericTweetConfig from "@/contributions/tweet";
import genericConfig from "@/contributions/generic/config";
import linkConfig from "./etc/link.config";
import appConfig from "./etc/app.config";
import newsConfig from "./etc/news.config";

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
      contributions: {
        app: appConfig({
          description: "My App Description",
          options: {
            imagePath: "./images",
            absoluteImagePath: "content/services/apps/images",
          },
        }),
        news: newsConfig,
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
        tweet: genericTweetConfig({
          options: { description: "Here's my custom description" },
        }),
        // testing: kitchenSinkGenericConfig,
        // tweet: tweetConfig({
        //   title: "TEST CONTRIBUTION TITLE",
        //   description: "TEST CONTRIBUTION DESCRIPTION",
        // }),
      },
    },
  },
};

export const DEV: AppConfig = {
  title: "DEV C11R",
  repos: {
    Another: {
      title: "Testing",
      description: "Test Description",
      contributions: {
        // genericTweet: genericTweetConfig,
        // collection: collectionConfig,
        app: appConfig({
          description: "My App Description",
          options: {
            imagePath: "./images",
            absoluteImagePath: "content/services/apps/images",
          },
        }),
        news: newsConfig,
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
        tweet: genericTweetConfig({
          options: { description: "Here's my custom description" },
        }),
        // testing: kitchenSinkGenericConfig,
        // tweet: tweetConfig({
        //   options: {
        //     text: {
        //       placeholder: "e.g. This is my development tweet",
        //       tags: ["#Contribunator"],
        //       suggestions: [
        //         ...tweetSuggestions(),
        //         {
        //           hasNo: "Contribunator",
        //           message: "Include the word Contribunator in your tweet!",
        //         },
        //       ],
        //     },
        //   },
        // }),
      },
    },
  },
};

export const DEMO: AppConfig = {
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A useless and vandalized demo repository for Contribunator",
      contributions: {
        // cool: genericConfig({
        //   title: "Generic Contribution",
        //   description: "A generic contribution",
        // }),
        // tweet: tweetConfig(),
      },
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
