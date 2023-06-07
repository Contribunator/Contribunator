import genericConfig from "@/contributions/generic/config";
import {
  FaDiscord,
  FaFacebook,
  FaNewspaper,
  FaReddit,
  FaTelegramPlane,
  FaTwitter,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { HiLink } from "react-icons/hi";

const categoriesMap = {
  wallets: {
    title: "Wallet",
    options: {
      web: {
        title: "Web Wallet",
      },
      browser: {
        title: "Browser Integrated Wallet",
      },
      hardware: {
        title: "Hardware Wallet",
      },
      software: {
        title: "Software Wallet",
      },
      other: {
        title: "Other Wallet Product",
      },
    },
  },
  exchanges: {
    title: "Exchange",
    options: {
      trustMinimized: {
        title: "Trust-Minimizing Exchange (DEX)",
      },
      centralizedSpot: {
        title: "Centralized Spot Market (CEX)",
      },
      derivative: {
        title: "Centralized Derivative Market",
      },
      crossChain: {
        title: "Cross-Chain Swap Exchange",
      },
      nfts: {
        title: "NFT Marketplace",
      },
      other: {
        title: "Other Exchange Service",
      },
    },
  },
  social: {
    title: "Social Channels",
    options: {
      chatRooms: {
        title: "General Chat Room",
      },
      developmentChat: {
        title: "Development Chat Room",
      },
      telegramGroups: {
        title: "Telegram Group",
      },
      forums: {
        title: "Forum",
      },
      youtubeChannels: {
        title: "YouTube Channel or Playlist",
      },
      twitter: {
        title: "Twitter Account",
      },
      regional: {
        title: "Regional Community",
      },
    },
  },
  dev: {
    title: "Mining & Development",
    options: {
      priceSource: {
        title: "Price Source",
        destination: "some/path/to/price/source",
      },
      payment: {
        title: "Payment Processor",
      },
      dex: {
        title: "Development Experience",
      },
      endpoint: {
        title: "RPC Endpoint",
      },
      pools: {
        title: "Mining Pool",
      },
      explorers: {
        title: "Blockchain Explorer",
      },
      monitors: {
        title: "Network Monitor",
      },
      repoWithDescrpition: {
        title: "Git Repository",
      },
    },
  },
  // TODO others with descriptions
};

export default genericConfig({
  title: "Links",
  description: "Add links to a website",
  icon: HiLink,
  // this needs to be dynamic based on the request
  // useFilesOnServer: {
  //   links: "links.yaml",
  // },
  options: {
    commit: async ({ files, timestamp, body: { name, url, category } }) => {
      throw new Error("Testing!");
      // if links file doesnt exist, create it
      // const links = files.links?.parsed || [];
      // // append the new link to the links array
      // links.push({ name, url, category, timestamp });
      // // return the new links array
      // return { yaml: { "links.yaml": links } };
    },
    fields: {
      links: {
        type: "collection",
        addButton: "Add antoher link",
        // title: "Links",
        fields: {
          category: {
            type: "choice",
            validation: { required: true },
            title: "Category",
            options: categoriesMap,
          },
          name: {
            type: "text",
            title: "Name",
            placeholder: "e.g. The Best Website Ever",
            validation: { required: true, min: 3, max: 50 },
          },
          url: {
            type: "text",
            title: "URL",
            placeholder: "e.g. https://www.example.com",
            validation: { required: true, url: true },
          },
          website: {
            type: "text",
            title: "Website URL",
            placeholder: "e.g. https://www.example.com",
            validation: { url: true },
            visible: ({ formik, field }) => {
              const parent = formik.getFieldProps(field.name.split(".")[0]);
              return parent.value?.category?.includes("endpoint");
            },
          },
          icon: {
            title: "Icon",
            type: "choice",
            unset: "No Icon",
            as: "buttons",
            // TODO this should be used in schema to validate
            visible: ({ formik, field }) => {
              const parent = formik.getFieldProps(field.name.split(".")[0]);
              return parent.value?.category?.includes("social");
            },
            options: {
              facebook: { icon: FaFacebook },
              twitter: { icon: FaTwitter },
              telegram: { icon: FaTelegramPlane },
              discord: { icon: FaDiscord },
              youtube: { icon: FaYoutube },
              video: { icon: FaVideo },
              reddit: { icon: FaReddit },
              newspaper: { icon: FaNewspaper },
            },
          },
          description: {
            title: "Description",
            type: "text",
            as: "textarea",
            placeholder: "e.g. The best website ever",
            visible: ({ formik, field }) => {
              const parent = formik.getFieldProps(field.name.split(".")[0]);
              return parent.value?.category?.includes("WithDescription");
            },
          },
        },
      },
    },
  },
});
