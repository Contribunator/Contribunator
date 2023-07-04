import app from "@/lib/contribution/etc/app";
import link from "@/lib/contribution/etc/link";
import news from "@/lib/contribution/etc/news";
import video from "@/lib/contribution/etc/video";
import tweet from "@/lib/contribution/tweet";

import { UserConfig } from "@/types";

const commonTweetOpts = {
  addLabels: ["c11r"],
  requestReviewers: {
    teams: ["tweeters"],
  },
  options: {
    retweetTextRequired: true,
  },
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
  authorization: ["github", "captcha", "api"],
  title: "Ethereum Classic Contributions",
  description:
    "This website makes it easy to contribute content updates to Ethereum Classic Github repositories without needing to know how to make Pull Requests.",
  owner: "ethereumclassic",
  prPostfix:
    "\n\n---\n*Created using the [ETC Contribunator Bot](https://github.com/ethereumclassic/Contribunator)*",
  repos: {
    "tweets-eth_classic": {
      title: "@eth_classic Tweets",
      addLabels: commonTweetOpts.addLabels,
      requestReviewers: commonTweetOpts.requestReviewers,
      description: commonTweetOpts.classic,
      contributions: {
        tweet: tweet({
          title: "Suggest a Tweet for @eth_classic",
          options: commonTweetOpts.options,
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
      addLabels: commonTweetOpts.addLabels,
      requestReviewers: commonTweetOpts.requestReviewers,
      description: commonTweetOpts.network,
      contributions: {
        tweet: tweet({
          title: "Suggest a Tweet for @ETC_Network",
          options: commonTweetOpts.options,
          form: async () => ({
            description: `${commonTweetOpts.network} ${commonTweetOpts.description}`,
            fields: {
              text: {
                placeholder: commonTweetOpts.placeholder,
                tags: commonTweetOpts.tags,
              },
            },
          }),
        }),
      },
    },
    "ethereumclassic.github.io": {
      title: "EthereumClassic.org Website",
      addLabels: ["c11r"],
      requestReviewers: {
        teams: ["website"],
      },
      description: "Submit updates to the EthereumClassic.org website.",
      contributions: {
        dapp: app({
          title: "Application",
          description: "A dapp or protocol to appear in the services section.",
          form: {
            title: "Submit a Decentralized App",
            description:
              "Complete this form to add your dapp or protocol to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the Apps and Procotols section.",
          },
          options: {
            relativeImagePath: "./images/",
            absoluteImagePath: "content/services/apps/images/",
            collectionPath: "content/services/apps/apps.collection.yaml",
          },
        }),
        video: video({
          title: "Video",
          description:
            "A YouTube video about ETC, which will appear in the videos section and on the front page.",
          form: {
            title: "Submit a YouTube Video",
            description:
              "Complete this form to add your video to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the videos section and front page.",
          },
          options: {
            collectionPath: "content/videos/videos.collection.en.yaml",
          },
        }),
        news: news({
          title: "News Article",
          description:
            "An external link to an article about ETC, which will appear in the news section and on the front page.",
          form: {
            title: "Submit a News Article",
            description:
              "Complete this form to add your external news article link to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the news section and front page.",
          },
          options: { collectionPath: "content/news/links.collection.en.yaml" },
        }),
        link: link({
          title: "Service Link",
          description:
            "An external link to appear in various parts of the website, such as Wallets, Exchanges, Social Channels, Mining Pools, etc.",
          form: {
            title: "Submit a Service Link",
            description:
              "Complete this form to add your external service link to EthereumClassic.org. Your submission will be reviwed and, if approved, added to the the relevant section.",
          },
          options: {
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
                  showDescription: true,
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
                  sourcePath: "content/development/repositories/index.yaml",
                  sourceKey: "repos",
                },
              },
            },
          },
        }),
      },
    },
  },
};

export default config;
