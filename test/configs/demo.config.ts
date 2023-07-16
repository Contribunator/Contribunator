import contribution from "@/lib/contribution";

import type { UserConfig } from "@/types";

import { HiPhotograph } from "react-icons/hi";
import { combined } from "./fields";
import tweet from "@/lib/contribution/tweet";

const demoConfig: UserConfig = {
  authorization: ["github", "captcha"],
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A demo repository to test out Contribunator",
      addLabels: ["c11r"],
      requestReviewers: {
        users: ["IstoraMandiri"],
        teams: ["contribunators"],
      },
      contributions: {
        simple: contribution({
          title: "A Simple Test",
          description: "Submit a message that will be appended to the readme.",
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
        image: contribution({
          title: "A Simple Image Upload",
          description: "Demos adding images to the repo.",
          icon: HiPhotograph,
          imagePath: "images/",
          commit: async ({ images }) => ({ images }),
          form: {
            fields: {
              image: {
                type: "images",
                title: "Image",
                validation: { required: true },
              },
            },
          },
        }),
        tweet: tweet(),
        combined,
        // ...e2eConfig.repos?._E2E_test.contributions,
      },
    },
  },
};

export default demoConfig;
