import { AppConfig } from "@/util/config";

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
      contributions: [
        {
          title: "TEST CONTRIBUTION TITLE",
          description: "TEST CONTRIBUTION DESCRIPTION",
          type: "tweet",
          color: "blue",
        },
      ],
    },
  },
};

export const DEMO: AppConfig = {
  repos: {
    Another: {
      title: "Testing",
      description: "Test Description",
      contributions: [
        {
          title: "Tweet",
          color: "blue",
          description: "Tweet about this project",
          type: "tweet",
          options: {
            text: {
              placeholder: "e.g. This is my development tweet",
              tags: ["#Contribunator"],
              suggestions: [
                {
                  hasNo: "Contribunator",
                  message: "Include the word Contribunator in your tweet!",
                },
              ],
            },
          },
        },
      ],
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

if (process.env.NEXT_PUBLIC_TESTING) {
  console.log("loaded test config", process.env.NEXT_PUBLIC_TESTING);
}

export default exported;
