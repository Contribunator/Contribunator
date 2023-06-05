import genericConfig from "@/contributions/generic/config";
import tweetConfig, { tweetSuggestions } from "@/contributions/tweet/config";
import { AppConfig } from "@/lib/config";
import kitchenSinkGenericConfig from "./configs/kitchenSink.generic.config";

export const E2E: AppConfig = {
  authorization: ["github", "anon"],
  title: "TEST TITLE",
  description: "TEST DESCRIPTION",
  owner: "test-owner",
  base: "test-base",
  branchPrefix: "test-branch-prefix/",
  repos: {
    TEST: {
      title: "TEST REPO TITLE",
      description: "TEST REPO DESCRIPTION",
      contributions: {
        // generic: genericConfig({
        //   title: "TEST GENERIC TITLE",
        //   description: "TEST GENERIC DESCRIPTION",
        // }),
        tweet: tweetConfig({
          title: "TEST CONTRIBUTION TITLE",
          description: "TEST CONTRIBUTION DESCRIPTION",
        }),
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
        "kitchen-sink": kitchenSinkGenericConfig,
        link: genericConfig({
          title: "Link",
          description: "A link to a website",
          options: {
            commit: async (data) => {
              console.log(data);
              throw new Error("Just testing");
              return { files: { "link.txt": data.body.url } };
            },
            fields: {
              category: {
                type: "choice",
                validation: { required: "Please select a category" },
                // component: "buttons",
                title: "Category",
                options: {
                  books: {
                    text: "Books",
                    options: {
                      fiction: {
                        text: "Fiction",
                      },
                      nonfiction: {
                        text: "Non-Fiction",
                        options: {
                          "self-help": {
                            text: "Self-Help",
                          },
                          "how-to": {
                            text: "How-To",
                          },
                          diy: {
                            text: "DIY",
                          },
                        },
                      },
                    },
                  },
                  movies: {
                    text: "Movies",
                  },
                  music: {
                    text: "Music",
                  },
                },
              },
              name: {
                type: "text",
                title: "Name",
                placeholder: "e.g. The Best Website Ever",
                // todo some common validation types, like URL.
              },
              url: {
                type: "text",
                title: "URL",
                placeholder: "e.g. https://www.example.com",
                // todo some common validation types, like URL.
              },
              // treeCatego: {
              //   type: "choice",

              // }
            },
          },
        }),
        tweet: tweetConfig({
          options: {
            text: {
              placeholder: "e.g. This is my development tweet",
              tags: ["#Contribunator"],
              suggestions: [
                ...tweetSuggestions(),
                {
                  hasNo: "Contribunator",
                  message: "Include the word Contribunator in your tweet!",
                },
              ],
            },
          },
        }),
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
        tweet: tweetConfig(),
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
