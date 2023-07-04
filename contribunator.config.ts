import contribution from "@/lib/contribution";

import tweet from "contributions/tweet";

import { UserConfig } from "@/types";
import {
  HiCursorClick,
  HiLink,
  HiNewspaper,
  HiVideoCamera,
} from "react-icons/hi";

const config: UserConfig = {
  authorization: ["github", "captcha", "api"],
  title: "Ethereum Classic Contributions",
  description:
    "This website makes it easy to contribute content updates to Ethereum Classic Github repositories without needing to know how to make Pull Requests.",
  owner: "ethereumclassic",
  prPostfix:
    "\n\n---\n*Created using the [ETC Contribunator Bot](https://github.com/ethereumclassic/Contribunator)*",
  repos: {
    "tweets-eth_classic": tweet({
      account: "@eth_classic",
      description:
        "Tweet to the main ETC Twitter Account. Suggested tweets should remain professional, relevant and neutral.",
    }),
    "tweets-etc_network": tweet({
      account: "@ETC_Network",
      description:
        "Tweet to the secondary ETC Twitter Account. Compared to the main account, there are are less restrictions. Use this account for less neutral, more spicy content.",
    }),
    "ethereumclassic.github.io": {
      title: "EthereumClassic.org Website",
      addLabels: ["c11r"],
      requestReviewers: { teams: ["website"] },
      description: "Submit updates to the EthereumClassic.org website.",
      contributions: {
        dapp: contribution({
          title: "Application",
          icon: HiCursorClick,
          color: "purple",
          description: "A dapp or protocol to appear in the services section.",
          form: {
            title: "Submit a Decentralized App",
            description:
              "Complete this form to add your dapp or protocol to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the Apps and Procotols section.",
          },
          load: async () => import("./contributions/dapp"),
        }),
        video: contribution({
          title: "Video",
          icon: HiVideoCamera,
          color: "red",
          description:
            "A YouTube video about ETC, which will appear in the videos section and on the front page.",
          form: {
            title: "Submit a YouTube Video",
            description:
              "Complete this form to add your video to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the videos section and front page.",
          },
          load: async () => import("./contributions/video"),
        }),
        news: contribution({
          title: "News Article",
          icon: HiNewspaper,
          color: "green",
          description:
            "An external link to an article about ETC, which will appear in the news section and on the front page.",
          form: {
            title: "Submit a News Article",
            description:
              "Complete this form to add your external news article link to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the news section and front page.",
          },
          load: async () => import("./contributions/news"),
        }),
        links: contribution({
          title: "Service Link",
          icon: HiLink,
          color: "yellow",
          description:
            "An external link to appear in various parts of the website, such as Wallets, Exchanges, Social Channels, Mining Pools, etc.",
          form: {
            title: "Submit a Service Link",
            description:
              "Complete this form to add your external service link to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the the relevant section.",
          },
          load: async () => import("./contributions/link"),
        }),
      },
    },
  },
};

export default config;
