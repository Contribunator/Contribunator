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
          useFilesOnServer: {
            links: "links.yaml",
          },
          options: {
            commit: async ({
              files,
              timestamp,
              body: { name, url, category },
            }) => {
              // if links file doesnt exist, create it
              const links = files.links?.parsed || [];
              // append the new link to the links array
              links.push({ name, url, category, timestamp });
              // return the new links array
              return { yaml: { "links.yaml": links } };
            },
            fields: {
              category: {
                type: "choice",
                validation: { required: true },
                component: "buttons",
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
                validation: { required: true, min: 3, max: 50 },
              },
              url: {
                type: "text",
                title: "URL",
                placeholder: "e.g. https://www.example.com",
                validation: { required: true, url: true, max: 100 },
              },
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
