import type {
  ContributionLoaded,
  ContributionOptions,
  UserConfig,
} from "@/types";

import userConfig from "@/../contribunator.config";

import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";
import news from "@/lib/contribution/etc/news";
import link from "@/lib/contribution/etc/link";
import app from "@/lib/contribution/etc/app";
import video from "@/lib/contribution/etc/video";

import fieldTests, { combined } from "./fields";
import buildConfig from "@/lib/helpers/buildConfig";

const testContributionLoaded: ContributionLoaded = {
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
const testContribution: ContributionOptions = {
  load: async () => testContributionLoaded,
};

const test = contribution(testContribution);

const testConfig: UserConfig = {
  authorization: ["github", "anon", "api"],
  title: "E2E C11R",
  description:
    "This is a test mode for end-to-end testing, using a Mock Github API",
  owner: "test-owner",
  repos: {
    ...(userConfig?.repos && buildConfig(userConfig).repos),
    _E2E_test: {
      title: "TEST REPO TITLE",
      description: "TEST REPO DESCRIPTION",
      addLabels: ["test-tag"],
      requestReviewers: {
        users: ["test-user"],
        teams: ["test-team"],
      },
      contributions: {
        api: contribution({
          hidden: true,
          load: async () => ({
            ...testContributionLoaded,
            form: {
              fields: {
                ...testContributionLoaded.form.fields,
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
        }),
        combined,
        tweet: tweet({
          description: "Here's my custom description",
        }),
        app: app({
          description: "My App Description",
          options: {
            relativeImagePath: "./images/",
            absoluteImagePath: "content/services/apps/images/",
            collectionPath: "test/etc/apps.yaml",
          },
        }),
        video: video({
          options: {
            collectionPath: "test/etc/videos.yaml",
          },
        }),
        news: news({
          options: {
            collectionPath: "test/etc/news.yaml",
          },
        }),
        link: link({
          options: {
            keyMap: {
              name: "__name",
              link: "__link",
              icon: "__icon",
            },
            categories: {
              wallets: {
                title: "Wallet",
                sourcePath: "test/etc/wallets.yaml",
                web: {
                  title: "Web Wallet",
                  sourceKey: "web",
                },
                browser: {
                  title: "Browser Integrated Wallet",
                  sourceKey: "browsers",
                },
              },
              social: {
                showIcons: true,
                title: "Social Channels",
                sourcePath: "test/etc/channels.yaml",
                chatRooms: {
                  title: "General Chat Room",
                  sourceKey: "Chat Rooms",
                },
                developmentChat: {
                  title: "Development Chat Room",
                  sourceKey: "Development Chat",
                },
                telegramGroups: {
                  title: "Telegram Group",
                  sourceKey: "Telegram Groups",
                },
              },
              dev: {
                title: "Mining & Development",
                priceSource: {
                  title: "Price Source",
                  sourcePath: "test/etc/tooling.yaml",
                  sourceKey: "prices",
                },
                repo: {
                  showDescription: true,
                  title: "Git Repository",
                  sourcePath: "test/etc/tooling.yaml",
                  sourceKey: "repos",
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
