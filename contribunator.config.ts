import { AppConfig, Contribution } from "@/util/config";
import { FaTwitter } from "react-icons/fa";

const tweet: Contribution = {
  type: "tweet",
  title: "Suggest a Tweet",
  color: "blue",
  icon: FaTwitter,
  description: "Your submission will be reviwed and tweeted if accepted",
};

// override default config here, see src/config.ts for defaults
const config: AppConfig = {
  title: "Ethereum Classic Contributions",
  description:
    "This website makes it easy to contribute content updates to Ethereum Classic Github repositories without needing to know how to make Pull Requests.",
  owner: "ethereumclassic",
  repos: {
    "tweets-eth_classic": {
      title: "@eth_classic tweets",
      description:
        "The main ETC Twitter Account. Suggested tweets should remain professional, relevant and neutral.",
      contributions: [tweet],
    },
    "tweets-etc_network": {
      title: "@ETC_Network tweets",
      description:
        "The secondary ETC Twitter Account. Suggested tweets have less restrictions, and can be less formal. See respository for more details.",
      contributions: [tweet],
    },
  },
};

export default config;
