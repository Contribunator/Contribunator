import type { ContributionLoaded, UserConfig } from "@/types";

import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";

import fieldTests, { combined } from "./fields";

const testContribution: ContributionLoaded = {
  commit: async ({ data, fetched, files }) => ({
    files: {
      "test.md": JSON.stringify(data),
    },
    yaml: {
      "test.yaml": {
        data,
        fetched,
        yaml: files.testYaml.parsed,
        md: files.testMd.content,
      },
    },
    json: {
      "test.json": {
        data,
        fetched,
        json: files.testJson.parsed,
        md: files.testMd.content,
      },
    },
  }),
  useFiles: () => ({ testMd: "test/test.md" }),
  useFilesOnServer: {
    testYaml: "test/test.yaml",
    testJson: "test/test.json",
  },
  useDataOnServer: async (props) => {
    return { test: "data" };
  },
  form: {
    fields: {
      text: {
        type: "text",
        title: "Text",
        validation: { required: true },
      },
    },
  },
};

const test = contribution(testContribution);

const testConfig: UserConfig = {
  authorization: ["github", "anon", "api"],
  title: "E2E C11R",
  description:
    "This is a test mode for end-to-end testing, using a Mock Github API",
  owner: "test-owner",
  repos: {
    // TODO way do user tests
    // ...(userConfig?.repos && buildConfig(userConfig).repos),
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

export default testConfig;
