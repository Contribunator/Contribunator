import { AppConfig } from "@/util/config";

// override default config here, see src/config.ts for defaults
const config: AppConfig = {
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
        },
      ],
    },
  },
};

export default config;
