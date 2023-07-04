// import path from "path";
// import fs from "fs/promises";
import type { UserConfig } from "@/types";

import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";

import fieldTests, { combined } from "./fields";
import test, { testContribution } from "./test.contribution";
import buildConfig from "@/lib/helpers/buildConfig";

async function getUserTestConfig() {
  if (process.env.userTestConfig) {
    const userTestConfig = await import(
      // @ts-ignore - this module might not exist
      `@/../contributions/test/configs/test.config`
    );
    return buildConfig(userTestConfig.default as UserConfig).repos;
  }
}

export default async function testConfig(): Promise<UserConfig> {
  return {
    authorization: ["github", "anon", "api"],
    title: "E2E C11R",
    description:
      "This is a test mode for end-to-end testing, using a Mock Github API",
    owner: "test-owner",
    repos: {
      ...(await getUserTestConfig()),
      _E2E_test: {
        title: "TEST REPO TITLE",
        description: "TEST REPO DESCRIPTION",
        addLabels: ["test-tag"],
        requestReviewers: {
          users: ["test-user"],
          teams: ["test-team"],
        },
        contributions: {
          combined,
          api: contribution({
            hidden: true,
            ...testContribution,
            form: {
              fields: {
                ...testContribution.form.fields,
                collection: {
                  type: "collection",
                  title: "Test Collection",
                  addButton: true,
                  fields: {
                    text: {
                      type: "text",
                      title: "Sub Text",
                    },
                  },
                },
              },
            },
          }),
        },
      },
      _E2E_fields: {
        title: "Field Tests",
        contributions: fieldTests,
      },
      _E2E_overrides: {
        title: "Title Override",
        description: "Description Override",
        owner: "owner-override",
        branchPrefix: "prefix-override/",
        base: "base-override",
        contributions: {
          test: contribution({
            ...testContribution,
            title: "Override Contribution Title",
            description: "Override Contribution Description",
          }),
        },
      },
      _E2E_github: {
        authorization: ["github"],
        title: "Github Only",
        contributions: {
          test,
        },
      },
      _E2E_api: {
        authorization: ["api"],
        title: "API Only",
        contributions: {
          test,
        },
      },
      _E2E_anon: {
        authorization: ["anon"],
        title: "Anon Only",
        contributions: {
          test,
        },
      },
      _E2E_tweets: {
        title: "Tweet Configs",
        contributions: {
          tweet: tweet({
            form: {
              fields: {
                text: {
                  placeholder: "This is my test placeholder!",
                  tags: ["test", "tags"],
                },
              },
            },
          }),
          tweetTextRequired: tweet({
            title: "Retweet Text Required",
            options: {
              retweetTextRequired: true,
            },
          }),
        },
      },
    },
  };
}
