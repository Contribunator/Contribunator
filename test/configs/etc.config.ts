import app from "@/lib/contribution/etc/app";
import link from "@/lib/contribution/etc/link";
import news from "@/lib/contribution/etc/news";
import tweet from "@/lib/contribution/tweet";

import { UserConfig } from "@/types";

const commonTweetOpts = {
  placeholder:
    "e.g. Decentralized, Immutable, Unstoppable!\n\n$ETC #EthereumClassic #ClassicIsComing 🍀",
  tags: [
    "🍀",
    "🚀",
    "💚",
    "🔥",
    "🎉",
    "$ETC",
    "#ETC",
    "#EthereumClassic",
    "#ETCArmy",
    "#ClassicIsComing",
    "#CodeIsLaw",
    "#Decentralization",
    "#DeFi",
    "#BTC",
    "#web3",
    "#Crypto",
    "#NFT",
    "#cryptocurrency",
    "#mining",
    "EthereumClassic.org",
  ],
  description:
    "Please check the repository rules before submitting to increase the chances that your tweet is accepted.",
  classic:
    "Tweet to the main ETC Twitter Account. Suggested tweets should remain professional, relevant and neutral.",
  network:
    "Tweet to the secondary ETC Twitter Account. Compared to the main account, there are are less restrictions. Use this account for less neutral, more spicy content.",
};

const config: UserConfig = {
  authorization: ["github", "captcha"],
  title: "Ethereum Classic Contributions",
  description:
    "This website makes it easy to contribute content updates to Ethereum Classic Github repositories without needing to know how to make Pull Requests.",
  owner: "ethereumclassic",
  base: "master",
  prPostfix:
    "\n\n---\n*Created using the [ETC Contribunator Bot](https://github.com/ethereumclassic/Contribunator)*",
  repos: {
    "tweets-eth_classic": {
      title: "@eth_classic Tweets",
      description: commonTweetOpts.classic,
      contributions: {
        tweet: tweet({
          title: "Suggest a Tweet for @eth_classic",
          form: {
            description: `${commonTweetOpts.classic} ${commonTweetOpts.description}`,
            fields: {
              text: {
                placeholder: commonTweetOpts.placeholder,
                tags: commonTweetOpts.tags,
              },
            },
          },
        }),
      },
    },
    "tweets-etc_network": {
      title: "@ETC_Network Tweets",
      description: commonTweetOpts.network,
      contributions: {
        tweet: tweet({
          title: "Suggest a Tweet for @ETC_Network",
          form: {
            description: `${commonTweetOpts.network} ${commonTweetOpts.description}`,
            fields: {
              text: {
                placeholder: commonTweetOpts.placeholder,
                tags: commonTweetOpts.tags,
              },
            },
          },
        }),
      },
    },
    "ethereumclassic.github.io": {
      title: "EthereumClassic.org Website",
      description: "Submit updates to the EthereumClassic.org website.",
      contributions: {
        dapp: app({
          title: "Application",
          description: "A dapp or protocol to appear in the services section.",
          relativeImagePath: "./images",
          absoluteImagePath: "content/services/apps/images",
          collectionPath: "content/services/apps/apps.collection.yaml",
        }),
        news: news({
          title: "News Headline",
          description:
            "An external link to an article about ETC, which will appear in the news section and on the front page.",
          collectionPath: "content/news/links.collection.en.yaml",
        }),
        link: link({
          title: "Service Link",
          description:
            "An external link to appear in various parts of the website, such as Wallets, Exchanges, Social Channels, Mining Pools, etc.",
          keyMap: {
            name: "__name",
            link: "__link",
            icon: "__icon",
          },
          categories: {
            wallets: {
              title: "Wallet",
              sourcePath: "content/services/wallets/index.yaml",
              web: {
                title: "Web Wallet",
                sourceKey: "web",
              },
              browser: {
                title: "Browser Integrated Wallet",
                sourceKey: "browsers",
              },
              hardware: {
                title: "Hardware Wallet",
                sourceKey: "hardware",
              },
              software: {
                title: "Software Wallet",
                sourceKey: "software",
              },
              other: {
                title: "Other Wallet Product",
                sourceKey: "other",
              },
            },
            exchanges: {
              title: "Exchange",
              sourcePath: "content/services/exchanges/index.yaml",
              trustMinimized: {
                title: "Trust-Minimizing Exchange (DEX)",
                sourceKey: "Trust-Minimizing Exchanges",
              },
              centralizedSpot: {
                title: "Centralized Spot Market (CEX)",
                sourceKey: "Centralized Spot Markets",
              },
              derivative: {
                title: "Centralized Derivative Market",
                sourceKey: "Centralized Derivative Markets",
              },
              crossChain: {
                title: "Cross-Chain Swap Exchange",
                sourceKey: "Cross-Chain Swap Exchanges",
              },
              nfts: {
                title: "NFT Marketplace",
                sourceKey: "NFT Marketplaces",
              },
              other: {
                title: "Other Exchange Service",
                sourceKey: "Other",
              },
            },
            social: {
              showIcons: true,
              title: "Social Channels",
              sourcePath: "content/community/channels/index.yaml",
              chatRooms: {
                title: "General Chat Room",
                sourceKey: "Chat Rooms",
              },
              developmentChat: {
                title: "Development Chat Room",
                sourceKey: "Development Chat",
              },
              telegramGroups: {
                title: "Telegram Group",
                sourceKey: "Telegram Groups",
              },
              forums: {
                title: "Forum",
                sourceKey: "Forums",
              },
              youtubeChannels: {
                title: "YouTube Channel or Playlist",
                sourceKey: "Media",
              },
              twitter: {
                title: "Twitter Account",
                sourceKey: "Twitter Accounts",
              },
              regional: {
                title: "Regional Community Websites",
                sourceKey: "Regional Website",
              },
            },
            dev: {
              title: "Mining & Development",
              priceSource: {
                title: "Price Source",
                sourcePath: "content/development/tooling/index.yaml",
                sourceKey: "prices",
              },
              payment: {
                title: "Payment Processor",
                sourcePath: "content/development/tooling/index.yaml",
                sourceKey: "processors",
              },
              dex: {
                title: "Development Experience",
                sourcePath: "content/development/tooling/index.yaml",
                sourceKey: "dex",
              },
              // TODO ?
              // endpoint: {
              //   showWebsite: true,
              //   title: "RPC Endpoint",
              //   sourcePath: "content/network/endpoints/index.yaml",
              //   sourceKey: "endpoints",
              // },
              pools: {
                title: "Mining Pool",
                sourcePath: "content/mining/pools/index.yaml",
                sourceKey: "pools",
              },
              // explorers: {
              //   title: "Blockchain Explorer",
              //   sourcePath: "content/network/explorers/index.yaml",
              //   sourceKey: "explorers",
              //   keyMap: {
              //     url: "etc",
              //   },
              // },
              monitors: {
                title: "Network Monitor",
                sourcePath: "content/network/monitors/index.yaml",
                sourceKey: "monitors",
              },
              repo: {
                showDescription: true,
                title: "Git Repository",
                sourcePath: "content/development/tooling/index.yaml",
                sourceKey: "repos",
              },
            },
          },
        }),
      },
    },
  },
};

export default config;
