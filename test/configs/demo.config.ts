import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";

import type { UserConfig } from "@/types";

import e2eConfig from "./test.config";

const demoConfig: UserConfig = {
  authorization: ["github", "captcha"],
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A demo repository to test out Contribunator",
      contributions: {
        simple: contribution({
          title: "A Simple Test",
          description: "Submit a message that will be appended to the readme.",
          load: async () => ({
            useFilesOnServer: {
              readme: "README.md",
            },
            commit: async ({ data, timestamp, files: { readme } }) => ({
              files: {
                "README.md": `${readme.content}
---

${timestamp}: ${data.text}
`,
              },
            }),
            form: {
              fields: {
                text: {
                  type: "text",
                  title: "Your message",
                  placeholder: "e.g. Hello, World!",
                  validation: { required: true },
                },
              },
            },
          }),
        }),
        ...e2eConfig.repos?.TEST.contributions,
        tweet: tweet({
          description: "Submits a twitter-together compatible tweet PR",
        }),
      },
    },
  },
};

export default demoConfig;
