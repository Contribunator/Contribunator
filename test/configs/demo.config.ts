import contribution from "@/lib/contribution";
import tweet from "@/lib/contribution/tweet";
import timestamp from "@/lib/helpers/timestamp";
import { UserConfig } from "@/types";

const demoConfig: UserConfig = {
  authorization: ["github", "captcha"],
  repos: {
    Sample: {
      title: "Sample Repo",
      description: "A demo repository to test out Contribunator",
      contributions: {
        tweet: tweet({
          description: "Here's my custom description",
        }),
        simple: contribution({
          title: "A Simple Test",
          description: "Submit a message that will be appended to the readme.",
          useFilesOnServer: {
            readme: "README.md",
          },
          commit: async ({ body, files: { readme } }) => ({
            files: {
              "README.md": `${readme.parsed}\n\n---\n\n${timestamp()}: ${
                body.text
              }`,
            },
          }),
          form: {
            fields: {
              text: {
                type: "text",
                title: "Your message",
                validation: { required: true },
              },
            },
          },
        }),
      },
    },
  },
};

export default demoConfig;
