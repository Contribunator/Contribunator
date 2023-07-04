export const categories = {
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
};
