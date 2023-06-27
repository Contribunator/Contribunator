import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";

import type { UserConfig } from "@/types";

import { combined } from "./fields";

const demoConfig: UserConfig = {
  authorization: ["github", "captcha"],
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A demo repository to test out Contribunator",
      contributions: {
        combined,
        tweet: tweet({
          description: "Here's my custom description",
        }),
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
      },
    },
  },
};

export default demoConfig;
